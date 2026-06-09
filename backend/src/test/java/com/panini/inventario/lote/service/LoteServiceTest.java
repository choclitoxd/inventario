package com.panini.inventario.lote.service;

import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.model.dto.EntradaLoteDTO;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.negocio.model.Negocio;
import com.panini.inventario.negocio.repository.NegocioRepository;
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
public class LoteServiceTest {

    @Mock
    private LoteInversionistaRepository loteInversionistaRepository;

    @Mock
    private NegocioRepository negocioRepository;

    @InjectMocks
    private LoteService loteService;

    @Test
    void registrarEntradaLote_InversionistaExterno_DebeAsignarDeudaInicial() {
        Negocio negocio = Negocio.builder().id(1).nombre("Sede Test").build();
        when(negocioRepository.findById(1)).thenReturn(Optional.of(negocio));

        when(loteInversionistaRepository.save(any(LoteInversionista.class))).thenAnswer(i -> i.getArguments()[0]);

        EntradaLoteDTO dto = new EntradaLoteDTO(
            "Lote Test 001",
            LoteInversionista.Financiador.INVERSIONISTA_EXTERNO,
            null, // inversionistaId
            new BigDecimal("1000000"), // montoPrestado
            new BigDecimal("50.00") // porcentajeGananciaAmortizacion
        );

        LoteInversionista loteGuardado = loteService.registrarEntradaLote(dto, 1);

        assertNotNull(loteGuardado);
        assertEquals(new BigDecimal("1000000"), loteGuardado.getMontoPrestado());
        assertEquals(new BigDecimal("1000000"), loteGuardado.getSaldoPendiente());
        assertEquals(LoteInversionista.Financiador.INVERSIONISTA_EXTERNO, loteGuardado.getFinanciador());
        assertEquals(negocio, loteGuardado.getNegocio());
    }
}
