package com.panini.inventario.stock.service;

import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.model.RegistroCajaAbierta;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.stock.repository.RegistroCajaAbiertaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InventarioServiceTest {

    @Mock
    private InventarioRepository inventarioRepository;
    
    @Mock
    private RegistroCajaAbiertaRepository registroCajaAbiertaRepository;

    @InjectMocks
    private InventarioService inventarioService;

    private Inventario inventarioLaminas;
    private Inventario inventarioAlbumes;

    @BeforeEach
    void setUp() {
        Producto prodLaminas = Producto.builder().tipo(Producto.Tipo.LAMINAS).build();
        inventarioLaminas = Inventario.builder()
                .producto(prodLaminas)
                .cantActualPacas(2)
                .cantActualCajas(5)
                .cantActualUnidades(10)
                .build();

        Producto prodAlbumes = Producto.builder().tipo(Producto.Tipo.ALBUM).build();
        inventarioAlbumes = Inventario.builder()
                .producto(prodAlbumes)
                .cantActualPacas(2)
                .cantActualUnidades(5)
                .build();
    }

    @Test
    void abrirCaja_DebeRestarCajaYSumarSobres() {
        when(inventarioRepository.findById(1)).thenReturn(Optional.of(inventarioLaminas));

        inventarioService.abrirCaja(1);

        assertEquals(4, inventarioLaminas.getCantActualCajas());
        assertEquals(114, inventarioLaminas.getCantActualUnidades()); // 10 + 104 sobres
        verify(inventarioRepository).save(inventarioLaminas);
        verify(registroCajaAbiertaRepository).save(any(RegistroCajaAbierta.class));
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
        when(inventarioRepository.findById(1)).thenReturn(Optional.of(inventarioLaminas));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> inventarioService.abrirCaja(1));
        assertTrue(ex.getMessage().contains("No hay suficientes cajas"));
    }
}
