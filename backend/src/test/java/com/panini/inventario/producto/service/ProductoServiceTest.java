package com.panini.inventario.producto.service;

import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

    @Test
    void crearProducto_FraccionadoAlbumes_DebeRegistrarFactorConversion() {
        Producto input = Producto.builder()
                .nombre("Album Especial")
                .tipo(Producto.Tipo.FRACCIONADO_ALBUMES)
                .factorConversion(26)
                .precioSugeridoDefecto(new BigDecimal("15000"))
                .build();

        when(productoRepository.save(any(Producto.class))).thenAnswer(invocation -> {
            Producto arg = invocation.getArgument(0);
            arg.setId(100);
            return arg;
        });

        Producto saved = productoRepository.save(input);

        assertNotNull(saved);
        assertEquals(100, saved.getId());
        assertEquals(Producto.Tipo.FRACCIONADO_ALBUMES, saved.getTipo());
        assertEquals(26, saved.getFactorConversion());
        verify(productoRepository, times(1)).save(input);
    }
}
