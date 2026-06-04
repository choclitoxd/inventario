package com.panini.inventario.venta.service;

import com.panini.inventario.cliente.model.Cliente;
import com.panini.inventario.cliente.repository.ClienteRepository;
import com.panini.inventario.lote.model.AmortizacionDeuda;
import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.repository.AmortizacionDeudaRepository;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.venta.model.Venta;
import com.panini.inventario.venta.model.VentaDetalle;
import com.panini.inventario.venta.model.dto.VentaDTO;
import com.panini.inventario.venta.model.dto.VentaDetalleDTO;
import com.panini.inventario.venta.repository.VentaDetalleRepository;
import com.panini.inventario.venta.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class VentaService {

    private final VentaRepository ventaRepository;
    private final VentaDetalleRepository ventaDetalleRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final LoteInversionistaRepository loteInversionistaRepository;
    private final AmortizacionDeudaRepository amortizacionDeudaRepository;
    private final com.panini.inventario.negocio.repository.NegocioRepository negocioRepository;

    @Transactional
    public Venta registrarVenta(VentaDTO dto, Integer negocioId) {
        Cliente cliente;
        if (dto.clienteId() != null) {
            cliente = clienteRepository.findById(dto.clienteId())
                    .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con ID: " + dto.clienteId()));
        } else if (dto.clienteTelefono() != null) {
            cliente = clienteRepository.findByTelefonoAndNegocioId(dto.clienteTelefono(), negocioId)
                    .orElseGet(() -> {
                        if (dto.clienteNombre() == null || dto.clienteNombre().isBlank()) {
                            throw new IllegalArgumentException("Se requiere el nombre para crear un cliente nuevo");
                        }
                        com.panini.inventario.negocio.model.Negocio negocio = negocioRepository.findById(negocioId)
                                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));
                        return clienteRepository.save(Cliente.builder()
                                .nombre(dto.clienteNombre())
                                .telefono(dto.clienteTelefono())
                                .negocio(negocio)
                                .build());
                    });
        } else {
            throw new IllegalArgumentException("Debe enviar clienteId o clienteTelefono");
        }

        com.panini.inventario.negocio.model.Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));

        Venta venta = Venta.builder()
                .cliente(cliente)
                .metodoPago(dto.metodoPago())
                .totalVenta(BigDecimal.ZERO)
                .utilidadBrutaTotal(BigDecimal.ZERO)
                .negocio(negocio)
                .build();
        
        venta = ventaRepository.save(venta);

        BigDecimal totalVenta = BigDecimal.ZERO;
        BigDecimal totalUtilidad = BigDecimal.ZERO;

        for (VentaDetalleDTO detalleDto : dto.detalles()) {
            VentaDetalle detalle = procesarDetalle(detalleDto, venta, null);
            totalVenta = totalVenta.add(detalle.getSubtotal());
            totalUtilidad = totalUtilidad.add(detalle.getUtilidadNeta());
        }

        venta.setTotalVenta(totalVenta);
        venta.setUtilidadBrutaTotal(totalUtilidad);
        return ventaRepository.save(venta);
    }

    private VentaDetalle procesarDetalle(VentaDetalleDTO dto, Venta venta, VentaDetalle parent) {
        Producto producto = productoRepository.findById(dto.productoId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + dto.productoId()));

        Inventario inventario = null;
        BigDecimal costoTotal = BigDecimal.ZERO;

        // 1. Descontar Stock y Calcular Costos si aplica
        if (dto.inventarioId() != null) {
            inventario = inventarioRepository.findById(dto.inventarioId())
                    .orElseThrow(() -> new IllegalArgumentException("Inventario/Lote no encontrado con ID: " + dto.inventarioId()));
            
            int pacas = dto.cantidadPacas() != null ? dto.cantidadPacas() : 0;
            int cajas = dto.cantidadCajas() != null ? dto.cantidadCajas() : 0;
            int unidades = dto.cantidadUnidades() != null ? dto.cantidadUnidades() : 0;

            int actualPacas = inventario.getCantActualPacas() != null ? inventario.getCantActualPacas() : 0;
            int actualCajas = inventario.getCantActualCajas() != null ? inventario.getCantActualCajas() : 0;
            int actualUnidades = inventario.getCantActualUnidades() != null ? inventario.getCantActualUnidades() : 0;

            if (actualPacas < pacas || 
                actualCajas < cajas || 
                actualUnidades < unidades) {
                throw new IllegalStateException("Stock insuficiente en el lote para el producto " + producto.getNombre());
            }

            // Descontar físico
            inventario.setCantActualPacas(actualPacas - pacas);
            inventario.setCantActualCajas(actualCajas - cajas);
            inventario.setCantActualUnidades(actualUnidades - unidades);
            inventarioRepository.save(inventario);

            // Calcular Costo Congelado
            BigDecimal costoPaca = inventario.getCostoCompraPaca() != null ? inventario.getCostoCompraPaca() : BigDecimal.ZERO;
            BigDecimal costoCaja = inventario.getCostoCompraCaja() != null ? inventario.getCostoCompraCaja() : BigDecimal.ZERO;
            BigDecimal costoUnidad = inventario.getCostoCompraUnidad() != null ? inventario.getCostoCompraUnidad() : BigDecimal.ZERO;

            costoTotal = costoPaca.multiply(BigDecimal.valueOf(pacas))
                    .add(costoCaja.multiply(BigDecimal.valueOf(cajas)))
                    .add(costoUnidad.multiply(BigDecimal.valueOf(unidades)));
        }

        // 2. Calcular Subtotal (Precio de Venta)
        BigDecimal precioPaca = dto.precioVentaPaca() != null ? dto.precioVentaPaca() : BigDecimal.ZERO;
        BigDecimal precioCaja = dto.precioVentaCaja() != null ? dto.precioVentaCaja() : BigDecimal.ZERO;
        BigDecimal precioUnidad = dto.precioVentaUnidad() != null ? dto.precioVentaUnidad() : BigDecimal.ZERO;

        BigDecimal subtotal = precioPaca.multiply(BigDecimal.valueOf(dto.cantidadPacas() != null ? dto.cantidadPacas() : 0))
                .add(precioCaja.multiply(BigDecimal.valueOf(dto.cantidadCajas() != null ? dto.cantidadCajas() : 0)))
                .add(precioUnidad.multiply(BigDecimal.valueOf(dto.cantidadUnidades() != null ? dto.cantidadUnidades() : 0)));

        BigDecimal utilidadNeta = subtotal.subtract(costoTotal);
        BigDecimal montoAmortizado = BigDecimal.ZERO;

        // 3. Lógica de Amortización Automática a Inversionistas Externos
        if (inventario != null && inventario.getLoteInversionista().getFinanciador() == LoteInversionista.Financiador.INVERSIONISTA_EXTERNO) {
            LoteInversionista lote = inventario.getLoteInversionista();
            
            if (utilidadNeta.compareTo(BigDecimal.ZERO) > 0 && lote.getSaldoPendiente().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal porcentaje = lote.getPorcentajeGananciaAmortizacion().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
                montoAmortizado = utilidadNeta.multiply(porcentaje);
                
                // Evitar pagar de más si el saldo pendiente es menor al calculado
                if (montoAmortizado.compareTo(lote.getSaldoPendiente()) > 0) {
                    montoAmortizado = lote.getSaldoPendiente();
                }

                lote.setSaldoPendiente(lote.getSaldoPendiente().subtract(montoAmortizado));
                if (lote.getSaldoPendiente().compareTo(BigDecimal.ZERO) == 0) {
                    lote.setEstado(LoteInversionista.Estado.LIQUIDADO);
                }
                loteInversionistaRepository.save(lote);
            }
        }

        // 4. Guardar Detalle
        VentaDetalle detalle = VentaDetalle.builder()
                .venta(venta)
                .inventario(inventario)
                .producto(producto)
                .parentDetalle(parent)
                .cantidadPacas(dto.cantidadPacas())
                .cantidadCajas(dto.cantidadCajas())
                .cantidadUnidades(dto.cantidadUnidades())
                .precioVentaPaca(dto.precioVentaPaca())
                .precioVentaCaja(dto.precioVentaCaja())
                .precioVentaUnidad(dto.precioVentaUnidad())
                .subtotal(subtotal)
                .costoTotal(costoTotal)
                .utilidadNeta(utilidadNeta)
                .montoAmortizadoInversionista(montoAmortizado)
                .build();

        detalle = ventaDetalleRepository.save(detalle);

        // 5. Dejar rastro en el historial de Amortizaciones
        if (montoAmortizado.compareTo(BigDecimal.ZERO) > 0) {
            AmortizacionDeuda amortizacion = AmortizacionDeuda.builder()
                    .loteInversionista(inventario.getLoteInversionista())
                    .ventaDetalle(detalle)
                    .montoAmortizado(montoAmortizado)
                    .tipo(AmortizacionDeuda.TipoAmortizacion.AUTOMATICA_VENTA)
                    .notas("Amortización automática extraída de la venta #" + venta.getId())
                    .build();
            amortizacionDeudaRepository.save(amortizacion);
        }

        // 6. Recursividad: Procesar Componentes Hijos (Combos)
        if (dto.componentesCombo() != null && !dto.componentesCombo().isEmpty()) {
            for (VentaDetalleDTO hijoDto : dto.componentesCombo()) {
                procesarDetalle(hijoDto, venta, detalle); // Se guardan como detalle en BD asociados al parentDetalle
            }
        }

        return detalle;
    }
}
