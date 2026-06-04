package com.panini.inventario.lote.service;

import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.model.dto.EntradaLoteDTO;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.repository.InventarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class LoteService {

    private final LoteInversionistaRepository loteInversionistaRepository;
    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;
    private final com.panini.inventario.negocio.repository.NegocioRepository negocioRepository;

    @Transactional
    public Inventario registrarEntradaLote(EntradaLoteDTO dto, Integer negocioId) {
        Producto producto = productoRepository.findById(dto.productoId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + dto.productoId()));

        com.panini.inventario.negocio.model.Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));

        LoteInversionista lote = LoteInversionista.builder()
                .nombreLote(dto.nombreLote())
                .financiador(dto.financiador())
                .porcentajeGananciaAmortizacion(dto.porcentajeGananciaAmortizacion() != null ? dto.porcentajeGananciaAmortizacion() : BigDecimal.ZERO)
                .montoPrestado(dto.financiador() == LoteInversionista.Financiador.INVERSIONISTA_EXTERNO ? dto.deudaInicial() : BigDecimal.ZERO)
                .saldoPendiente(dto.financiador() == LoteInversionista.Financiador.INVERSIONISTA_EXTERNO ? dto.deudaInicial() : BigDecimal.ZERO)
                .estado(LoteInversionista.Estado.ACTIVO)
                .negocio(negocio)
                .build();
        
        lote = loteInversionistaRepository.save(lote);

        Inventario inventario = Inventario.builder()
                .producto(producto)
                .loteInversionista(lote)
                .cantInicialPacas(dto.cantPacas() != null ? dto.cantPacas() : 0)
                .cantInicialCajas(dto.cantCajas() != null ? dto.cantCajas() : 0)
                .cantInicialUnidades(dto.cantUnidades() != null ? dto.cantUnidades() : 0)
                .cantActualPacas(dto.cantPacas() != null ? dto.cantPacas() : 0)
                .cantActualCajas(dto.cantCajas() != null ? dto.cantCajas() : 0)
                .cantActualUnidades(dto.cantUnidades() != null ? dto.cantUnidades() : 0)
                .costoCompraPaca(dto.costoCompraPaca())
                .costoCompraCaja(dto.costoCompraCaja())
                .costoCompraUnidad(dto.costoCompraUnidad())
                .build();

        return inventarioRepository.save(inventario);
    }
}
