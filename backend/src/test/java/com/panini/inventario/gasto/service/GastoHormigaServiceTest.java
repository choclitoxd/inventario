package com.panini.inventario.gasto.service;

import com.panini.inventario.gasto.model.GastoHormiga;
import com.panini.inventario.gasto.model.dto.GastoHormigaDTO;
import com.panini.inventario.gasto.repository.GastoHormigaRepository;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GastoHormigaServiceTest {

    @Mock
    private GastoHormigaRepository gastoHormigaRepository;

    @Mock
    private LoteInversionistaRepository loteInversionistaRepository;

    @InjectMocks
    private GastoHormigaService gastoHormigaService;

    @Test
    void registrarGasto_SinLote_DebeGuardarGastoExitosamente() {
        when(gastoHormigaRepository.save(any(GastoHormiga.class))).thenAnswer(i -> i.getArguments()[0]);

        GastoHormigaDTO dto = new GastoHormigaDTO(
                "Almuerzo", new BigDecimal("15000"), GastoHormiga.CategoriaGasto.ALIMENTACION, null
        );

        GastoHormiga gasto = gastoHormigaService.registrarGasto(dto);

        assertEquals("Almuerzo", gasto.getDescripcion());
        assertEquals(new BigDecimal("15000"), gasto.getMonto());
        assertNull(gasto.getLoteInversionista());
    }
}
