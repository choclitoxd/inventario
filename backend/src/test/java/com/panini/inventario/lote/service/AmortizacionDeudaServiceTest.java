package com.panini.inventario.lote.service;

import com.panini.inventario.lote.model.AmortizacionDeuda;
import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.repository.AmortizacionDeudaRepository;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AmortizacionDeudaServiceTest {

    @Mock
    private AmortizacionDeudaRepository amortizacionDeudaRepository;

    @Mock
    private LoteInversionistaRepository loteInversionistaRepository;

    @InjectMocks
    private AmortizacionDeudaService amortizacionDeudaService;

    @Test
    void registrarAbonoManual_DebeDescontarSaldo_YLiquidarSiLlegaACero() {
        LoteInversionista lote = LoteInversionista.builder()
                .financiador(LoteInversionista.Financiador.INVERSIONISTA_EXTERNO)
                .saldoPendiente(new BigDecimal("1000"))
                .estado(LoteInversionista.Estado.ACTIVO)
                .build();
        
        when(loteInversionistaRepository.findById(1)).thenReturn(Optional.of(lote));

        amortizacionDeudaService.registrarAbonoManual(1, new BigDecimal("1000"), "Abono total definitivo");

        assertEquals(new BigDecimal("0"), lote.getSaldoPendiente());
        assertEquals(LoteInversionista.Estado.LIQUIDADO, lote.getEstado());
        verify(loteInversionistaRepository).save(lote);
        verify(amortizacionDeudaRepository).save(any(AmortizacionDeuda.class));
    }
}
