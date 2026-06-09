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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DeudaServiceTest {

    @Mock
    private AmortizacionDeudaRepository amortizacionDeudaRepository;

    @Mock
    private LoteInversionistaRepository loteInversionistaRepository;

    @InjectMocks
    private AmortizacionDeudaService amortizacionDeudaService;

    @Test
    void registrarAbonoManual_DebeActualizarSaldoMatematicamenteDeFormaCorrecta() {
        // Arrange
        LoteInversionista lote = LoteInversionista.builder()
                .financiador(LoteInversionista.Financiador.INVERSIONISTA_EXTERNO)
                .saldoPendiente(new BigDecimal("5000"))
                .estado(LoteInversionista.Estado.ACTIVO)
                .build();
        
        when(loteInversionistaRepository.findById(1)).thenReturn(Optional.of(lote));

        // Act
        amortizacionDeudaService.registrarAbonoManual(1, new BigDecimal("1500"), "Abono parcial");

        // Assert
        assertEquals(0, new BigDecimal("3500").compareTo(lote.getSaldoPendiente()));
        assertEquals(LoteInversionista.Estado.ACTIVO, lote.getEstado());
        verify(loteInversionistaRepository).save(lote);
        verify(amortizacionDeudaRepository).save(any(AmortizacionDeuda.class));
    }
}
