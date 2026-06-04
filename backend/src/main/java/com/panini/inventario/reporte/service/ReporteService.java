package com.panini.inventario.reporte.service;

import com.panini.inventario.gasto.model.GastoHormiga;
import com.panini.inventario.gasto.repository.GastoHormigaRepository;
import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.venta.model.Venta;
import com.panini.inventario.venta.model.VentaDetalle;
import com.panini.inventario.venta.repository.VentaDetalleRepository;
import com.panini.inventario.venta.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final VentaRepository ventaRepository;
    private final VentaDetalleRepository ventaDetalleRepository;
    private final GastoHormigaRepository gastoHormigaRepository;
    private final LoteInversionistaRepository loteInversionistaRepository;

    public ResumenFinancieroDTO obtenerResumen(LocalDateTime desde, LocalDateTime hasta, Integer negocioId) {
        if (negocioId == null) {
            return new ResumenFinancieroDTO(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        List<Venta> ventas = ventaRepository.findByNegocioId(negocioId).stream()
                .filter(v -> (desde == null || !v.getFechaVenta().isBefore(desde)) && 
                             (hasta == null || !v.getFechaVenta().isAfter(hasta)))
                .collect(Collectors.toList());

        List<GastoHormiga> gastos = gastoHormigaRepository.findByNegocioId(negocioId).stream()
                .filter(g -> (desde == null || !g.getFechaGasto().isBefore(desde)) && 
                             (hasta == null || !g.getFechaGasto().isAfter(hasta)))
                .collect(Collectors.toList());

        BigDecimal totalVentas = ventas.stream()
                .map(Venta::getTotalVenta)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal utilidadBruta = ventas.stream()
                .map(Venta::getUtilidadBrutaTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Let's use the correct getter: getUtilidadBrutaTotal()
        BigDecimal totalGastos = gastos.stream()
                .map(GastoHormiga::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal utilidadNeta = utilidadBruta.subtract(totalGastos);

        return new ResumenFinancieroDTO(totalVentas, utilidadBruta, totalGastos, utilidadNeta);
    }

    public List<CapitalSegmentadoDTO> obtenerCapitalSegmentado(Integer negocioId) {
        if (negocioId == null) {
            return List.of();
        }

        List<LoteInversionista> lotes = loteInversionistaRepository.findByNegocioId(negocioId);
        List<VentaDetalle> detalles = ventaDetalleRepository.findAll().stream()
                .filter(d -> d.getVenta() != null && d.getVenta().getNegocio() != null && d.getVenta().getNegocio().getId().equals(negocioId))
                .collect(Collectors.toList());

        Map<LoteInversionista.Financiador, List<LoteInversionista>> lotesPorFinanciador = lotes.stream()
                .collect(Collectors.groupingBy(LoteInversionista::getFinanciador));

        List<CapitalSegmentadoDTO> reporte = new ArrayList<>();

        for (LoteInversionista.Financiador financiador : LoteInversionista.Financiador.values()) {
            List<LoteInversionista> lotesFinanciador = lotesPorFinanciador.getOrDefault(financiador, Collections.emptyList());

            BigDecimal montoPrestadoTotal = lotesFinanciador.stream()
                    .map(l -> l.getMontoPrestado() != null ? l.getMontoPrestado() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal saldoPendienteTotal = lotesFinanciador.stream()
                    .map(l -> l.getSaldoPendiente() != null ? l.getSaldoPendiente() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal amortizadoTotal = montoPrestadoTotal.subtract(saldoPendienteTotal);

            // Filtrar detalles asociados a lotes de este financiador
            Set<Integer> loteIds = lotesFinanciador.stream().map(LoteInversionista::getId).collect(Collectors.toSet());
            List<VentaDetalle> detallesFinanciador = detalles.stream()
                    .filter(d -> d.getInventario() != null && d.getInventario().getLoteInversionista() != null &&
                            loteIds.contains(d.getInventario().getLoteInversionista().getId()))
                    .collect(Collectors.toList());

            BigDecimal ventasTotales = detallesFinanciador.stream()
                    .map(VentaDetalle::getSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal utilidadBruta = detallesFinanciador.stream()
                    .map(VentaDetalle::getUtilidadNeta)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            reporte.add(new CapitalSegmentadoDTO(
                    financiador.name(),
                    ventasTotales,
                    utilidadBruta,
                    montoPrestadoTotal,
                    saldoPendienteTotal,
                    amortizadoTotal
            ));
        }

        return reporte;
    }

    public List<FluctuacionPrecioDTO> obtenerFluctuacionPrecios(Integer negocioId) {
        if (negocioId == null) {
            return List.of();
        }

        List<VentaDetalle> detalles = ventaDetalleRepository.findAll().stream()
                .filter(d -> d.getVenta() != null && d.getVenta().getNegocio() != null && d.getVenta().getNegocio().getId().equals(negocioId))
                .collect(Collectors.toList());
        List<FluctuacionPrecioDTO> reporte = new ArrayList<>();

        for (VentaDetalle det : detalles) {
            if (det.getInventario() == null) continue;

            String productoNombre = det.getProducto().getNombre();
            String loteNombre = det.getInventario().getLoteInversionista().getNombreLote();
            LocalDateTime fecha = det.getVenta().getFechaVenta();

            // Paca
            if (det.getCantidadPacas() != null && det.getCantidadPacas() > 0) {
                reporte.add(new FluctuacionPrecioDTO(
                        productoNombre,
                        loteNombre,
                        fecha,
                        "PACA",
                        det.getInventario().getCostoCompraPaca(),
                        det.getPrecioVentaPaca()
                ));
            }
            // Caja
            if (det.getCantidadCajas() != null && det.getCantidadCajas() > 0) {
                reporte.add(new FluctuacionPrecioDTO(
                        productoNombre,
                        loteNombre,
                        fecha,
                        "CAJA",
                        det.getInventario().getCostoCompraCaja(),
                        det.getPrecioVentaCaja()
                ));
            }
            // Unidad
            if (det.getCantidadUnidades() != null && det.getCantidadUnidades() > 0) {
                reporte.add(new FluctuacionPrecioDTO(
                        productoNombre,
                        loteNombre,
                        fecha,
                        "UNIDAD",
                        det.getInventario().getCostoCompraUnidad(),
                        det.getPrecioVentaUnidad()
                ));
            }
        }

        return reporte;
    }

    public record ResumenFinancieroDTO(
            BigDecimal totalVentas,
            BigDecimal utilidadBruta,
            BigDecimal totalGastos,
            BigDecimal utilidadNeta
    ) {}

    public record CapitalSegmentadoDTO(
            String origenCapital,
            BigDecimal totalVentas,
            BigDecimal utilidadBruta,
            BigDecimal montoPrestadoTotal,
            BigDecimal saldoPendienteTotal,
            BigDecimal amortizadoTotal
    ) {}

    public record FluctuacionPrecioDTO(
            String productoNombre,
            String loteNombre,
            LocalDateTime fechaVenta,
            String nivelStock,
            BigDecimal costoCompra,
            BigDecimal precioVenta
    ) {}
}
