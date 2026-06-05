package com.panini.inventario.lote.service;

import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.model.dto.EntradaLoteDTO;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.negocio.model.Negocio;
import com.panini.inventario.negocio.repository.NegocioRepository;
import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.repository.InventarioRepository;
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
    private InventarioRepository inventarioRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private NegocioRepository negocioRepository;

    @InjectMocks
    private LoteService loteService;

    @Test
    void registrarEntradaLote_InversionistaExterno_DebeAsignarDeudaInicial() {
        Producto producto = Producto.builder().id(1).build();
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto));
        
        Negocio negocio = Negocio.builder().id(1).nombre("Sede Test").build();
        when(negocioRepository.findById(1)).thenReturn(Optional.of(negocio));

        when(loteInversionistaRepository.save(any(LoteInversionista.class))).thenAnswer(i -> i.getArguments()[0]);
        when(inventarioRepository.save(any(Inventario.class))).thenAnswer(i -> i.getArguments()[0]);

        EntradaLoteDTO dto = new EntradaLoteDTO(
            "Lote Test 001",
            LoteInversionista.Financiador.INVERSIONISTA_EXTERNO,
            new BigDecimal("50.00"), // 50% de las ganancias irán a abonos
            new BigDecimal("1000000"), // Deuda prestada
            1, 5, 0, 0,
            new BigDecimal("200000"), BigDecimal.ZERO, BigDecimal.ZERO
        );

        Inventario inventarioGuardado = loteService.registrarEntradaLote(dto, 1);

        assertNotNull(inventarioGuardado);
        assertEquals(5, inventarioGuardado.getCantActualPacas());
        
        LoteInversionista loteGuardado = inventarioGuardado.getLoteInversionista();
        assertEquals(new BigDecimal("1000000"), loteGuardado.getMontoPrestado());
        assertEquals(new BigDecimal("1000000"), loteGuardado.getSaldoPendiente());
        assertEquals(LoteInversionista.Financiador.INVERSIONISTA_EXTERNO, loteGuardado.getFinanciador());
        assertEquals(negocio, loteGuardado.getNegocio());
    }
}
