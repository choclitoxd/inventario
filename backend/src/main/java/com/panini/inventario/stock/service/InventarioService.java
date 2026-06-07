package com.panini.inventario.stock.service;

import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.model.RegistroCajaAbierta;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.stock.repository.RegistroCajaAbiertaRepository;
import com.panini.inventario.auditoria.service.AuditoriaService;
import com.panini.inventario.config.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.venta.repository.VentaDetalleRepository;
import com.panini.inventario.stock.dto.SedeInventarioRequest;
import com.panini.inventario.stock.dto.SedeInventarioUpdateRequest;
import java.util.List;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class InventarioService {

    private final InventarioRepository inventarioRepository;
    private final RegistroCajaAbiertaRepository registroCajaAbiertaRepository;
    private final AuditoriaService auditoriaService;
    private final ProductoRepository productoRepository;
    private final LoteInversionistaRepository loteInversionistaRepository;
    private final VentaDetalleRepository ventaDetalleRepository;

    @Transactional
    public Inventario abrirCaja(Integer productoId, Integer negocioId, String username) {
        if (negocioId == null) {
            throw new IllegalArgumentException("El ID del negocio/sede es requerido.");
        }

        List<Inventario> inventarios = inventarioRepository.findByProductoIdAndLoteInversionistaNegocioId(productoId, negocioId);

        // 1. Verificar si la sede cuenta con al menos 1 caja disponible en stock para ese producto
        Inventario inventarioConCaja = inventarios.stream()
                .filter(inv -> inv.getCantActualCajas() != null && inv.getCantActualCajas() >= 1)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No hay suficientes cajas en stock para este producto en la sede."));

        Producto.Tipo tipo = inventarioConCaja.getProducto().getTipo();
        if (tipo == Producto.Tipo.FRACCIONADO_LAMINAS) {
            // 2. Restar 1 unidad a la columna cant_actual_cajas
            inventarioConCaja.setCantActualCajas(inventarioConCaja.getCantActualCajas() - 1);

            // 3. Sumar 104 unidades a la columna cant_actual_unidades (sobres)
            inventarioConCaja.setCantActualUnidades(
                    (inventarioConCaja.getCantActualUnidades() != null ? inventarioConCaja.getCantActualUnidades() : 0) + 104
            );

            inventarioRepository.save(inventarioConCaja);

            // Registrar el evento de desglose
            RegistroCajaAbierta registro = RegistroCajaAbierta.builder()
                    .inventario(inventarioConCaja)
                    .cantidadCajas(1)
                    .sobresAdicionados(104)
                    .build();
            registroCajaAbiertaRepository.save(registro);

            // 4. Registrar obligatoriamente en la tabla de Auditoría (Bitácora) con la acción 'CONVERSIÓN_STOCK'
            String detalleDesglose = "Se abrió 1 caja de: " + inventarioConCaja.getProducto().getNombre() +
                    " (+104 sobres, lote: " + inventarioConCaja.getLoteInversionista().getNombreLote() + ")";
            auditoriaService.registrarAccion(username, "CONVERSIÓN_STOCK", detalleDesglose, negocioId);

            return inventarioConCaja;
        } else if (tipo == Producto.Tipo.FRACCIONADO_ALBUMES) {
            Integer factor = inventarioConCaja.getProducto().getFactorConversion();
            if (factor == null || factor <= 0) {
                factor = 26; // Valor por defecto
            }

            // 2. Restar 1 unidad a la columna cant_actual_cajas
            inventarioConCaja.setCantActualCajas(inventarioConCaja.getCantActualCajas() - 1);

            // 3. Sumar factor unidades a la columna cant_actual_unidades (álbumes sueltos)
            inventarioConCaja.setCantActualUnidades(
                    (inventarioConCaja.getCantActualUnidades() != null ? inventarioConCaja.getCantActualUnidades() : 0) + factor
            );

            inventarioRepository.save(inventarioConCaja);

            // Registrar el evento de desglose
            RegistroCajaAbierta registro = RegistroCajaAbierta.builder()
                    .inventario(inventarioConCaja)
                    .cantidadCajas(1)
                    .sobresAdicionados(factor)
                    .build();
            registroCajaAbiertaRepository.save(registro);

            // 4. Registrar obligatoriamente en la tabla de Auditoría (Bitácora) con la acción 'CONVERSIÓN_STOCK'
            String detalleDesglose = "Se abrió 1 caja de álbumes de: " + inventarioConCaja.getProducto().getNombre() +
                    " (+" + factor + " unidades, lote: " + inventarioConCaja.getLoteInversionista().getNombreLote() + ")";
            auditoriaService.registrarAccion(username, "CONVERSIÓN_STOCK", detalleDesglose, negocioId);

            return inventarioConCaja;
        } else {
            throw new BusinessException("Solo se pueden abrir cajas de productos tipo FRACCIONADO_LAMINAS o FRACCIONADO_ALBUMES");
        }
    }

    @Transactional
    public Inventario desglosar(Integer productoId, Integer loteId, String accion, String username) {
        if (productoId == null || loteId == null || accion == null) {
            throw new IllegalArgumentException("El ID del producto, ID del lote y la acción son requeridos.");
        }

        Inventario inv = inventarioRepository.findByProductoIdAndLoteInversionistaId(productoId, loteId)
                .orElseThrow(() -> new BusinessException("No se encontró inventario para el producto y lote especificados."));

        Integer negocioId = inv.getLoteInversionista().getNegocio().getId();

        if (accion.equalsIgnoreCase("CAJA")) {
            Producto.Tipo tipo = inv.getProducto().getTipo();
            if (tipo != Producto.Tipo.FRACCIONADO_LAMINAS && tipo != Producto.Tipo.FRACCIONADO_ALBUMES) {
                throw new BusinessException("Solo se pueden abrir cajas de productos fraccionados (Láminas o Álbumes).");
            }

            if (inv.getCantActualCajas() == null || inv.getCantActualCajas() < 1) {
                throw new IllegalStateException("No hay suficientes cajas en stock en este lote.");
            }

            Integer factor = 104;
            if (tipo == Producto.Tipo.FRACCIONADO_ALBUMES) {
                factor = inv.getProducto().getFactorConversion();
                if (factor == null || factor <= 0) {
                    factor = 26;
                }
            }

            inv.setCantActualCajas(inv.getCantActualCajas() - 1);
            inv.setCantActualUnidades((inv.getCantActualUnidades() != null ? inv.getCantActualUnidades() : 0) + factor);
            inventarioRepository.save(inv);

            // Registrar desglose
            RegistroCajaAbierta registro = RegistroCajaAbierta.builder()
                    .inventario(inv)
                    .cantidadCajas(1)
                    .sobresAdicionados(factor)
                    .build();
            registroCajaAbiertaRepository.save(registro);

            String detalle = "Se abrió 1 caja de: " + inv.getProducto().getNombre() +
                    " (+" + factor + " unidades, lote: " + inv.getLoteInversionista().getNombreLote() + ")";
            auditoriaService.registrarAccion(username, "CONVERSIÓN_STOCK", detalle, negocioId);

            return inv;

        } else if (accion.equalsIgnoreCase("PACA")) {
            if (inv.getCantActualPacas() == null || inv.getCantActualPacas() < 1) {
                throw new IllegalStateException("No hay suficientes pacas en stock en este lote.");
            }

            Producto.Tipo tipo = inv.getProducto().getTipo();
            inv.setCantActualPacas(inv.getCantActualPacas() - 1);

            if (tipo == Producto.Tipo.FRACCIONADO_LAMINAS) {
                inv.setCantActualCajas((inv.getCantActualCajas() != null ? inv.getCantActualCajas() : 0) + 10);
                inventarioRepository.save(inv);

                String detalle = "Se abrió 1 paca de láminas de: " + inv.getProducto().getNombre() +
                        " (+10 cajas, lote: " + inv.getLoteInversionista().getNombreLote() + ")";
                auditoriaService.registrarAccion(username, "ABRIR_PACA_LAMINAS", detalle, negocioId);

            } else if (tipo == Producto.Tipo.FRACCIONADO_ALBUMES) {
                inv.setCantActualUnidades((inv.getCantActualUnidades() != null ? inv.getCantActualUnidades() : 0) + 26);
                inventarioRepository.save(inv);

                String detalle = "Se abrió 1 paca de álbumes de: " + inv.getProducto().getNombre() +
                        " (+26 álbumes, lote: " + inv.getLoteInversionista().getNombreLote() + ")";
                auditoriaService.registrarAccion(username, "ABRIR_PACA_ALBUMES", detalle, negocioId);

            } else {
                throw new BusinessException("Solo se pueden abrir pacas de productos tipo FRACCIONADO_LAMINAS o FRACCIONADO_ALBUMES");
            }

            return inv;
        } else {
            throw new IllegalArgumentException("Acción de desglose no válida: " + accion);
        }
    }

    @Transactional
    public void abrirPacaLaminas(Integer inventarioId) {
        Inventario inventario = inventarioRepository.findById(inventarioId)
                .orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado con ID: " + inventarioId));

        if (inventario.getProducto().getTipo() != Producto.Tipo.FRACCIONADO_LAMINAS) {
            throw new IllegalStateException("Solo se pueden abrir pacas de productos tipo FRACCIONADO_LAMINAS");
        }

        if (inventario.getCantActualPacas() < 1) {
            throw new IllegalStateException("No hay suficientes pacas. Cantidad actual: " + inventario.getCantActualPacas());
        }

        // 1 Paca de Láminas = 10 Cajas
        inventario.setCantActualPacas(inventario.getCantActualPacas() - 1);
        inventario.setCantActualCajas(inventario.getCantActualCajas() + 10);
        inventarioRepository.save(inventario);
    }

    @Transactional
    public void abrirPacaAlbumes(Integer inventarioId) {
        Inventario inventario = inventarioRepository.findById(inventarioId)
                .orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado con ID: " + inventarioId));

        if (inventario.getProducto().getTipo() != Producto.Tipo.FRACCIONADO_ALBUMES) {
            throw new IllegalStateException("Solo se pueden abrir pacas de productos tipo FRACCIONADO_ALBUMES");
        }

        if (inventario.getCantActualPacas() < 1) {
            throw new IllegalStateException("No hay suficientes pacas. Cantidad actual: " + inventario.getCantActualPacas());
        }

        // 1 Paca de Álbumes = 26 Álbumes (unidades)
        inventario.setCantActualPacas(inventario.getCantActualPacas() - 1);
        inventario.setCantActualUnidades(inventario.getCantActualUnidades() + 26);
        inventarioRepository.save(inventario);
    }

    @Transactional
    public Inventario vincularProductoInventario(SedeInventarioRequest request, Integer negocioId, String username) {
        if (request.productoId() == null || request.loteId() == null) {
            throw new IllegalArgumentException("El ID del producto y del lote son obligatorios.");
        }

        Producto producto = productoRepository.findById(request.productoId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + request.productoId()));

        LoteInversionista lote = loteInversionistaRepository.findById(request.loteId())
                .orElseThrow(() -> new IllegalArgumentException("Lote no encontrado con ID: " + request.loteId()));

        if (!lote.getNegocio().getId().equals(negocioId)) {
            throw new BusinessException("El lote seleccionado no pertenece a la sede activa.");
        }

        // Check if link already exists
        if (inventarioRepository.findByProductoIdAndLoteInversionistaId(request.productoId(), request.loteId()).isPresent()) {
            throw new BusinessException("El producto ya está vinculado a este lote en la sede.");
        }

        Inventario inventario = Inventario.builder()
                .producto(producto)
                .loteInversionista(lote)
                .cantInicialPacas(request.cantPacas() != null ? request.cantPacas() : 0)
                .cantInicialCajas(request.cantCajas() != null ? request.cantCajas() : 0)
                .cantInicialUnidades(request.cantUnidades() != null ? request.cantUnidades() : 0)
                .cantActualPacas(request.cantPacas() != null ? request.cantPacas() : 0)
                .cantActualCajas(request.cantCajas() != null ? request.cantCajas() : 0)
                .cantActualUnidades(request.cantUnidades() != null ? request.cantUnidades() : 0)
                .costoCompraPaca(request.costoCompraPaca() != null ? request.costoCompraPaca() : BigDecimal.ZERO)
                .costoCompraCaja(request.costoCompraCaja() != null ? request.costoCompraCaja() : BigDecimal.ZERO)
                .costoCompraUnidad(request.costoCompraUnidad() != null ? request.costoCompraUnidad() : BigDecimal.ZERO)
                .build();

        inventario = inventarioRepository.save(inventario);

        auditoriaService.registrarAccion(username, "VINCULAR_PRODUCTO_SEDE",
                "Se vinculó el producto: " + producto.getNombre() + " (Lote: " + lote.getNombreLote() + ") a la sede.", negocioId);

        return inventario;
    }

    @Transactional
    public Inventario actualizarInventarioSede(Integer id, SedeInventarioUpdateRequest request, Integer negocioId, String username) {
        Inventario inv = inventarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado con ID: " + id));

        if (!inv.getLoteInversionista().getNegocio().getId().equals(negocioId)) {
            throw new BusinessException("El inventario no pertenece a la sede activa.");
        }

        inv.setCantActualPacas(request.cantActualPacas() != null ? request.cantActualPacas() : 0);
        inv.setCantActualCajas(request.cantActualCajas() != null ? request.cantActualCajas() : 0);
        inv.setCantActualUnidades(request.cantActualUnidades() != null ? request.cantActualUnidades() : 0);
        inv.setCostoCompraPaca(request.costoCompraPaca() != null ? request.costoCompraPaca() : BigDecimal.ZERO);
        inv.setCostoCompraCaja(request.costoCompraCaja() != null ? request.costoCompraCaja() : BigDecimal.ZERO);
        inv.setCostoCompraUnidad(request.costoCompraUnidad() != null ? request.costoCompraUnidad() : BigDecimal.ZERO);

        inv = inventarioRepository.save(inv);

        auditoriaService.registrarAccion(username, "ACTUALIZAR_INVENTARIO_SEDE",
                "Se actualizó stock/costo del producto: " + inv.getProducto().getNombre() + " (Lote: " + inv.getLoteInversionista().getNombreLote() + ")", negocioId);

        return inv;
    }

    @Transactional
    public void eliminarInventarioSede(Integer id, Integer negocioId, String username) {
        Inventario inv = inventarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado con ID: " + id));

        if (!inv.getLoteInversionista().getNegocio().getId().equals(negocioId)) {
            throw new BusinessException("El inventario no pertenece a la sede activa.");
        }

        int totalStock = (inv.getCantActualPacas() != null ? inv.getCantActualPacas() : 0) +
                         (inv.getCantActualCajas() != null ? inv.getCantActualCajas() : 0) +
                         (inv.getCantActualUnidades() != null ? inv.getCantActualUnidades() : 0);

        if (totalStock > 0) {
            throw new BusinessException("No se puede eliminar un producto con stock activo en la sede.");
        }

        long salesCount = ventaDetalleRepository.countByInventarioId(id);
        if (salesCount > 0) {
            throw new BusinessException("No se puede desvincular el producto de la sede porque tiene historial de ventas.");
        }

        registroCajaAbiertaRepository.deleteByInventarioId(id);
        inventarioRepository.delete(inv);

        auditoriaService.registrarAccion(username, "ELIMINAR_INVENTARIO_SEDE",
                "Se desvinculó el producto: " + inv.getProducto().getNombre() + " (Lote: " + inv.getLoteInversionista().getNombreLote() + ") de la sede.", negocioId);
    }
}
