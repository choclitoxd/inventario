package com.panini.inventario.stock.service;

import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.model.RegistroCajaAbierta;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.stock.repository.RegistroCajaAbiertaRepository;
import com.panini.inventario.auditoria.service.AuditoriaService;
import com.panini.inventario.config.BusinessException;
import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.negocio.model.Negocio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.venta.repository.VentaDetalleRepository;
import com.panini.inventario.stock.dto.SedeInventarioRequest;
import com.panini.inventario.stock.dto.SedeInventarioUpdateRequest;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

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

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private LoteInversionistaRepository loteInversionistaRepository;

    @Mock
    private VentaDetalleRepository ventaDetalleRepository;

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
                .tipo(Producto.Tipo.FRACCIONADO_LAMINAS)
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
                .tipo(Producto.Tipo.FRACCIONADO_ALBUMES)
                .factorConversion(26)
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
    void abrirCajaAlbumes_DebeRestarCajaYSumarAlbumes() {
        inventarioAlbumes.setCantActualCajas(3);
        inventarioAlbumes.setCantActualUnidades(10);
        when(inventarioRepository.findByProductoIdAndLoteInversionistaNegocioId(2, 1))
                .thenReturn(List.of(inventarioAlbumes));

        inventarioService.abrirCaja(2, 1, "testuser");

        assertEquals(2, inventarioAlbumes.getCantActualCajas());
        assertEquals(36, inventarioAlbumes.getCantActualUnidades()); // 10 + 26 factor conversion
        verify(inventarioRepository).save(inventarioAlbumes);
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

    @Test
    void abrirCaja_ProductoUnidadSimple_DebeLanzarBusinessException() {
        Producto prodSimple = Producto.builder()
                .nombre("Sticker Album Protector")
                .tipo(Producto.Tipo.UNIDAD_SIMPLE)
                .build();
        
        Inventario invSimple = Inventario.builder()
                .producto(prodSimple)
                .cantActualCajas(5)
                .cantActualUnidades(10)
                .build();

        when(inventarioRepository.findByProductoIdAndLoteInversionistaNegocioId(3, 1))
                .thenReturn(List.of(invSimple));

        assertThrows(BusinessException.class, () -> inventarioService.abrirCaja(3, 1, "testuser"));
        
        verify(inventarioRepository, never()).save(any(Inventario.class));
        verify(registroCajaAbiertaRepository, never()).save(any(RegistroCajaAbierta.class));
    }

    @Test
    void desglosar_cajaLaminas_DebeRestarCajaYSumarSobres() {
        when(inventarioRepository.findByProductoIdAndLoteInversionistaId(1, 100))
                .thenReturn(Optional.of(inventarioLaminas));
        
        inventarioLaminas.setCantActualCajas(5);
        inventarioLaminas.setCantActualUnidades(10);
        inventarioLaminas.getLoteInversionista().setId(100);

        Inventario result = inventarioService.desglosar(1, 100, "CAJA", "testuser");

        assertEquals(4, result.getCantActualCajas());
        assertEquals(114, result.getCantActualUnidades()); // 10 + 104
        verify(inventarioRepository).save(inventarioLaminas);
        verify(registroCajaAbiertaRepository).save(any(RegistroCajaAbierta.class));
        verify(auditoriaService).registrarAccion(eq("testuser"), eq("CONVERSIÓN_STOCK"), anyString(), eq(1));
    }

    @Test
    void desglosar_pacaLaminas_DebeRestarPacaYSumarCajas() {
        when(inventarioRepository.findByProductoIdAndLoteInversionistaId(1, 100))
                .thenReturn(Optional.of(inventarioLaminas));

        inventarioLaminas.setCantActualPacas(2);
        inventarioLaminas.setCantActualCajas(5);
        inventarioLaminas.getLoteInversionista().setId(100);

        Inventario result = inventarioService.desglosar(1, 100, "PACA", "testuser");

        assertEquals(1, result.getCantActualPacas());
        assertEquals(15, result.getCantActualCajas()); // 5 + 10
        verify(inventarioRepository).save(inventarioLaminas);
        verify(auditoriaService).registrarAccion(eq("testuser"), eq("ABRIR_PACA_LAMINAS"), anyString(), eq(1));
    }

    @Test
    void desglosar_pacaAlbumes_DebeRestarPacaYSumarUnidades() {
        when(inventarioRepository.findByProductoIdAndLoteInversionistaId(2, 100))
                .thenReturn(Optional.of(inventarioAlbumes));

        inventarioAlbumes.setCantActualPacas(2);
        inventarioAlbumes.setCantActualUnidades(5);
        inventarioAlbumes.getLoteInversionista().setId(100);

        Inventario result = inventarioService.desglosar(2, 100, "PACA", "testuser");

        assertEquals(1, result.getCantActualPacas());
        assertEquals(31, result.getCantActualUnidades()); // 5 + 26
        verify(inventarioRepository).save(inventarioAlbumes);
        verify(auditoriaService).registrarAccion(eq("testuser"), eq("ABRIR_PACA_ALBUMES"), anyString(), eq(1));
    }

    @Test
    void desglosar_cajaUnidadSimple_DebeLanzarBusinessException() {
        Producto prodSimple = Producto.builder()
                .nombre("Sticker Album Protector")
                .tipo(Producto.Tipo.UNIDAD_SIMPLE)
                .build();
        
        Inventario invSimple = Inventario.builder()
                .producto(prodSimple)
                .loteInversionista(inventarioLaminas.getLoteInversionista())
                .cantActualCajas(5)
                .cantActualUnidades(10)
                .build();

        when(inventarioRepository.findByProductoIdAndLoteInversionistaId(3, 100))
                .thenReturn(Optional.of(invSimple));

        assertThrows(BusinessException.class, () -> inventarioService.desglosar(3, 100, "CAJA", "testuser"));
        verify(inventarioRepository, never()).save(any(Inventario.class));
    }

    @Test
    void vincularProductoInventario_DebeCrearInventario() {
        Producto product = Producto.builder().id(10).nombre("Album Qatar").tipo(Producto.Tipo.FRACCIONADO_ALBUMES).build();
        Negocio negocio = Negocio.builder().id(1).build();
        LoteInversionista lote = LoteInversionista.builder().id(50).nombreLote("Lote Inversionista").negocio(negocio).build();
        SedeInventarioRequest req = new SedeInventarioRequest(10, 50, 2, 0, 10, BigDecimal.valueOf(100), BigDecimal.ZERO, BigDecimal.valueOf(5));

        when(productoRepository.findById(10)).thenReturn(Optional.of(product));
        when(loteInversionistaRepository.findById(50)).thenReturn(Optional.of(lote));
        when(inventarioRepository.findByProductoIdAndLoteInversionistaId(10, 50)).thenReturn(Optional.empty());
        when(inventarioRepository.save(any(Inventario.class))).thenAnswer(i -> i.getArguments()[0]);

        Inventario result = inventarioService.vincularProductoInventario(req, 1, "test_user");

        assertNotNull(result);
        assertEquals(product, result.getProducto());
        assertEquals(lote, result.getLoteInversionista());
        assertEquals(2, result.getCantActualPacas());
        assertEquals(10, result.getCantActualUnidades());
        verify(inventarioRepository).save(any(Inventario.class));
        verify(auditoriaService).registrarAccion(eq("test_user"), eq("VINCULAR_PRODUCTO_SEDE"), anyString(), eq(1));
    }

    @Test
    void actualizarInventarioSede_DebeActualizarStockYCostos() {
        SedeInventarioUpdateRequest req = new SedeInventarioUpdateRequest(3, 0, 15, BigDecimal.valueOf(110), BigDecimal.ZERO, BigDecimal.valueOf(6));
        when(inventarioRepository.findById(1)).thenReturn(Optional.of(inventarioAlbumes));
        when(inventarioRepository.save(any(Inventario.class))).thenAnswer(i -> i.getArguments()[0]);

        Inventario result = inventarioService.actualizarInventarioSede(1, req, 1, "test_user");

        assertNotNull(result);
        assertEquals(3, result.getCantActualPacas());
        assertEquals(15, result.getCantActualUnidades());
        assertEquals(BigDecimal.valueOf(110), result.getCostoCompraPaca());
        assertEquals(BigDecimal.valueOf(6), result.getCostoCompraUnidad());
        verify(inventarioRepository).save(inventarioAlbumes);
        verify(auditoriaService).registrarAccion(eq("test_user"), eq("ACTUALIZAR_INVENTARIO_SEDE"), anyString(), eq(1));
    }

    @Test
    void eliminarInventarioSede_DebeBorrarDesglosesEInventario() {
        inventarioAlbumes.setCantActualPacas(0);
        inventarioAlbumes.setCantActualCajas(0);
        inventarioAlbumes.setCantActualUnidades(0);

        when(inventarioRepository.findById(1)).thenReturn(Optional.of(inventarioAlbumes));
        when(ventaDetalleRepository.countByInventarioId(1)).thenReturn(0L);

        inventarioService.eliminarInventarioSede(1, 1, "test_user");

        verify(registroCajaAbiertaRepository).deleteByInventarioId(1);
        verify(inventarioRepository).delete(inventarioAlbumes);
        verify(auditoriaService).registrarAccion(eq("test_user"), eq("ELIMINAR_INVENTARIO_SEDE"), anyString(), eq(1));
    }

    @Test
    void eliminarInventarioSede_ConStock_DebeLanzarExcepcion() {
        inventarioAlbumes.setCantActualPacas(1); // active stock
        when(inventarioRepository.findById(1)).thenReturn(Optional.of(inventarioAlbumes));

        assertThrows(BusinessException.class, () -> inventarioService.eliminarInventarioSede(1, 1, "test_user"));
        verify(inventarioRepository, never()).delete(any(Inventario.class));
    }

    @Test
    void eliminarInventarioSede_ConVentas_DebeLanzarExcepcion() {
        inventarioAlbumes.setCantActualPacas(0);
        inventarioAlbumes.setCantActualCajas(0);
        inventarioAlbumes.setCantActualUnidades(0);

        when(inventarioRepository.findById(1)).thenReturn(Optional.of(inventarioAlbumes));
        when(ventaDetalleRepository.countByInventarioId(1)).thenReturn(5L); // historical sales

        assertThrows(BusinessException.class, () -> inventarioService.eliminarInventarioSede(1, 1, "test_user"));
        verify(inventarioRepository, never()).delete(any(Inventario.class));
    }
}
