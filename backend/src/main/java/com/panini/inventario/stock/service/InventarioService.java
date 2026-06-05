package com.panini.inventario.stock.service;

import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.model.RegistroCajaAbierta;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.stock.repository.RegistroCajaAbiertaRepository;
import com.panini.inventario.auditoria.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class InventarioService {

    private final InventarioRepository inventarioRepository;
    private final RegistroCajaAbiertaRepository registroCajaAbiertaRepository;
    private final AuditoriaService auditoriaService;

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

        if (inventarioConCaja.getProducto().getTipo() != Producto.Tipo.FRACCIONADO_COMPLEJO) {
            throw new IllegalStateException("Solo se pueden abrir cajas de productos tipo FRACCIONADO_COMPLEJO");
        }

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
    }

    @Transactional
    public void abrirPacaLaminas(Integer inventarioId) {
        Inventario inventario = inventarioRepository.findById(inventarioId)
                .orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado con ID: " + inventarioId));

        if (inventario.getProducto().getTipo() != Producto.Tipo.FRACCIONADO_COMPLEJO) {
            throw new IllegalStateException("Solo se pueden abrir pacas de productos tipo FRACCIONADO_COMPLEJO");
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

        if (inventario.getProducto().getTipo() != Producto.Tipo.UNIDADES_SIMPLES) {
            throw new IllegalStateException("Solo se pueden abrir pacas de productos tipo UNIDADES_SIMPLES");
        }

        if (inventario.getCantActualPacas() < 1) {
            throw new IllegalStateException("No hay suficientes pacas. Cantidad actual: " + inventario.getCantActualPacas());
        }

        // 1 Paca de Álbumes = 26 Álbumes (unidades)
        inventario.setCantActualPacas(inventario.getCantActualPacas() - 1);
        inventario.setCantActualUnidades(inventario.getCantActualUnidades() + 26);
        inventarioRepository.save(inventario);
    }
}
