package com.panini.inventario.lote.service;

import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.model.Inversionista;
import com.panini.inventario.lote.model.dto.EntradaLoteDTO;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.lote.repository.InversionistaRepository;
import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.venta.repository.VentaDetalleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class LoteService {

    private final LoteInversionistaRepository loteInversionistaRepository;
    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;
    private final com.panini.inventario.negocio.repository.NegocioRepository negocioRepository;
    private final VentaDetalleRepository ventaDetalleRepository;
    private final InversionistaRepository inversionistaRepository;

    @Transactional
    public LoteInversionista registrarEntradaLote(EntradaLoteDTO dto, Integer negocioId) {
        com.panini.inventario.negocio.model.Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));

        Inversionista inversionista = null;
        LoteInversionista.Financiador financiador = dto.financiador();
        
        if (dto.inversionistaId() != null) {
            inversionista = inversionistaRepository.findById(dto.inversionistaId())
                    .orElseThrow(() -> new IllegalArgumentException("Inversionista no encontrado con ID: " + dto.inversionistaId()));
            financiador = LoteInversionista.Financiador.INVERSIONISTA_EXTERNO;
        }

        BigDecimal porcentaje = dto.porcentajeGananciaAmortizacion() != null ? dto.porcentajeGananciaAmortizacion() : BigDecimal.ZERO;

        LoteInversionista lote = LoteInversionista.builder()
                .nombreLote(dto.nombreLote())
                .financiador(financiador)
                .inversionista(inversionista)
                .nombreInversionista(inversionista != null ? inversionista.getNombre() : null)
                .porcentajeGananciaAmortizacion(porcentaje)
                .montoPrestado(dto.montoPrestado() != null ? dto.montoPrestado() : BigDecimal.ZERO)
                .saldoPendiente(dto.montoPrestado() != null ? dto.montoPrestado() : BigDecimal.ZERO)
                .estado(LoteInversionista.Estado.ACTIVO)
                .negocio(negocio)
                .build();
        
        return loteInversionistaRepository.save(lote);
    }

    @Transactional
    public LoteInversionista editarLote(Integer id, String nombreLote, BigDecimal montoPrestado, BigDecimal saldoPendiente) {
        LoteInversionista lote = loteInversionistaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lote no encontrado con ID: " + id));
        lote.setNombreLote(nombreLote);
        if (lote.getFinanciador() == LoteInversionista.Financiador.INVERSIONISTA_EXTERNO) {
            lote.setMontoPrestado(montoPrestado != null ? montoPrestado : BigDecimal.ZERO);
            lote.setSaldoPendiente(saldoPendiente != null ? saldoPendiente : BigDecimal.ZERO);
        }
        return loteInversionistaRepository.save(lote);
    }

    @Transactional
    public void eliminarLote(Integer id) {
        LoteInversionista lote = loteInversionistaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lote no encontrado con ID: " + id));

        List<Inventario> inventories = inventarioRepository.findByLoteInversionistaId(id);
        
        for (Inventario inv : inventories) {
            long salesCount = ventaDetalleRepository.countByInventarioId(inv.getId());
            if (salesCount > 0) {
                throw new IllegalStateException("No se puede eliminar el lote '" + lote.getNombreLote() + "' porque ya tiene ventas registradas.");
            }
        }

        inventarioRepository.deleteAll(inventories);
        loteInversionistaRepository.delete(lote);
    }
}
