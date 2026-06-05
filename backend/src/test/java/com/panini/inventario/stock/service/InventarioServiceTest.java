package com.panini.inventario.stock.service;

import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.model.RegistroCajaAbierta;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.stock.repository.RegistroCajaAbiertaRepository;
import com.panini.inventario.auditoria.service.AuditoriaService;
import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.negocio.model.Negocio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InventarioServiceTest {

    @Mock
    private InventarioRepository inventarioRepository;
    
    @Mock
    private RegistroCajaAbiertaRepository registroCajaAbiertaRepository;

    @Mock
    private AuditoriaService auditoriaService;

    @InjectMocks
    private InventarioService inventarioService;

    private Inventario inventarioLaminas;
    private Inventario inventarioAlbumes;

    @BeforeEach
    void setUp() {
        Negocio negocio = Negocio.builder().id(1).build();
        LoteInversionista lote = LoteInversionista.builder()
                .nombreLote("Lote Test")
                .negocio(negocio)
                .build();

        Producto prodLaminas = Producto.builder()
                .nombre("Laminas Qatar")
                .tipo(Producto.Tipo.FRACCIONADO_COMPLEJO)
                .build();

        inventarioLaminas = Inventario.builder()
                .producto(prodLaminas)
                .loteInversionista(lote)
                .cantActualPacas(2)
                .cantActualCajas(5)
                .cantActualUnidades(10)
                .build();

        Producto prodAlbumes = Producto.builder()
                .nombre("Album Qatar")
                .tipo(Producto.Tipo.UNIDADES_SIMPLES)
                .build();

        inventarioAlbumes = Inventario.builder()
                .producto(prodAlbumes)
                .loteInversionista(lote)
                .cantActualPacas(2)
                .cantActualUnidades(5)
                .build();
    }

    @Test
    void abrirCaja_DebeRestarCajaYSumarSobres() {
        when(inventarioRepository.findByProductoIdAndLoteInversionistaNegocioId(1, 1))
                .thenReturn(List.of(inventarioLaminas));

        inventarioService.abrirCaja(1, 1, "testuser");

        assertEquals(4, inventarioLaminas.getCantActualCajas());
        assertEquals(114, inventarioLaminas.getCantActualUnidades()); // 10 + 104 sobres
        verify(inventarioRepository).save(inventarioLaminas);
        verify(registroCajaAbiertaRepository).save(any(RegistroCajaAbierta.class));
        verify(auditoriaService).registrarAccion(eq("testuser"), eq("CONVERSIÓN_STOCK"), anyString(), eq(1));
    }

    @Test
    void abrirPacaLaminas_DebeRestarPacaYSumarCajas() {
        when(inventarioRepository.findById(1)).thenReturn(Optional.of(inventarioLaminas));

        inventarioService.abrirPacaLaminas(1);

        assertEquals(1, inventarioLaminas.getCantActualPacas());
        assertEquals(15, inventarioLaminas.getCantActualCajas()); // 5 + 10 cajas
        verify(inventarioRepository).save(inventarioLaminas);
    }

    @Test
    void abrirPacaAlbumes_DebeRestarPacaYSumarUnidades() {
        when(inventarioRepository.findById(2)).thenReturn(Optional.of(inventarioAlbumes));

        inventarioService.abrirPacaAlbumes(2);

        assertEquals(1, inventarioAlbumes.getCantActualPacas());
        assertEquals(31, inventarioAlbumes.getCantActualUnidades()); // 5 + 26 álbumes sueltos
        verify(inventarioRepository).save(inventarioAlbumes);
    }

    @Test
    void abrirCaja_SinStock_DebeLanzarExcepcion() {
        inventarioLaminas.setCantActualCajas(0);
        when(inventarioRepository.findByProductoIdAndLoteInversionistaNegocioId(1, 1))
                .thenReturn(List.of(inventarioLaminas));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> inventarioService.abrirCaja(1, 1, "testuser"));
        assertTrue(ex.getMessage().contains("No hay suficientes cajas"));
    }
}
