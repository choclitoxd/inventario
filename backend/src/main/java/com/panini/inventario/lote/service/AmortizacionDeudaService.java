package com.panini.inventario.lote.service;

import com.panini.inventario.lote.model.AmortizacionDeuda;
import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.repository.AmortizacionDeudaRepository;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AmortizacionDeudaService {

    private final AmortizacionDeudaRepository amortizacionDeudaRepository;
    private final LoteInversionistaRepository loteInversionistaRepository;

    @Transactional
    public void registrarAbonoManual(Integer loteId, BigDecimal monto, String notas) {
        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto a amortizar debe ser mayor a 0");
        }

        LoteInversionista lote = loteInversionistaRepository.findById(loteId)
                .orElseThrow(() -> new IllegalArgumentException("Lote no encontrado con ID: " + loteId));

        if (lote.getFinanciador() != LoteInversionista.Financiador.INVERSIONISTA_EXTERNO) {
            throw new IllegalStateException("Solo se puede amortizar deuda de lotes fondeados por INVERSIONISTA_EXTERNO");
        }

        if (monto.compareTo(lote.getSaldoPendiente()) > 0) {
            throw new IllegalArgumentException("El monto a amortizar (" + monto + ") supera el saldo pendiente de la deuda (" + lote.getSaldoPendiente() + ")");
        }

        // 1. Actualizar saldo en el lote principal
        lote.setSaldoPendiente(lote.getSaldoPendiente().subtract(monto));
        
        // 2. Liquidar automáticamente si el saldo llega a 0
        if (lote.getSaldoPendiente().compareTo(BigDecimal.ZERO) == 0) {
            lote.setEstado(LoteInversionista.Estado.LIQUIDADO);
        }
        loteInversionistaRepository.save(lote);

        // 3. Registrar transacción financiera
        AmortizacionDeuda amortizacion = AmortizacionDeuda.builder()
                .loteInversionista(lote)
                .montoAmortizado(monto)
                .tipo(AmortizacionDeuda.TipoAmortizacion.PAGO_MANUAL)
                .notas(notas)
                .build();

        amortizacionDeudaRepository.save(amortizacion);
    }
}
