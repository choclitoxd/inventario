package com.panini.inventario.lote.service;

import com.panini.inventario.lote.model.Inversionista;
import com.panini.inventario.lote.repository.InversionistaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProveedorServiceTest {

    @Mock
    private InversionistaRepository inversionistaRepository;

    @InjectMocks
    private ProveedorService proveedorService;

    @Test
    void listarProveedores_DebeRetornarTodosLosProveedoresSinFiltrarPorSede() {
        // Arrange
        Inversionista prov1 = Inversionista.builder().id(1).nombre("Proveedor A").build();
        Inversionista prov2 = Inversionista.builder().id(2).nombre("Proveedor B").build();
        when(inversionistaRepository.findAll()).thenReturn(List.of(prov1, prov2));

        // Act
        List<Inversionista> result = proveedorService.listarProveedores();

        // Assert
        assertEquals(2, result.size());
        verify(inversionistaRepository, times(1)).findAll();
        verify(inversionistaRepository, never()).findByNegocioId(anyInt());
    }
}
