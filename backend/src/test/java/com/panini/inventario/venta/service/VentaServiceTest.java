package com.panini.inventario.venta.service;

import com.panini.inventario.cliente.model.Cliente;
import com.panini.inventario.cliente.repository.ClienteRepository;
import com.panini.inventario.lote.model.AmortizacionDeuda;
import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.repository.AmortizacionDeudaRepository;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.venta.model.Venta;
import com.panini.inventario.venta.model.VentaDetalle;
import com.panini.inventario.venta.model.dto.VentaDTO;
import com.panini.inventario.venta.model.dto.VentaDetalleDTO;
import com.panini.inventario.venta.repository.VentaDetalleRepository;
import com.panini.inventario.venta.repository.VentaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class VentaServiceTest {

    @Mock private VentaRepository ventaRepository;
    @Mock private VentaDetalleRepository ventaDetalleRepository;
    @Mock private ClienteRepository clienteRepository;
    @Mock private ProductoRepository productoRepository;
    @Mock private InventarioRepository inventarioRepository;
    @Mock private LoteInversionistaRepository loteInversionistaRepository;
    @Mock private AmortizacionDeudaRepository amortizacionDeudaRepository;

    @InjectMocks
    private VentaService ventaService;

    @Test
    void registrarVenta_DebeDescontarStock_CalcularUtilidad_YAmortizarAutomaticamente() {
        // Setup Cliente
        Cliente cliente = Cliente.builder().id(1).nombre("Victor").telefono("123456789").build();
        when(clienteRepository.findById(1)).thenReturn(Optional.of(cliente));

        // Setup Producto e Inventario
        Producto producto = Producto.builder().id(1).nombre("Caja Laminas").build();
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto));

        // Lote de inversionista que exige 50% de las ganancias para abonar a su deuda de $100.000
        LoteInversionista lote = LoteInversionista.builder()
                .financiador(LoteInversionista.Financiador.INVERSIONISTA_EXTERNO)
                .saldoPendiente(new BigDecimal("100000"))
                .porcentajeGananciaAmortizacion(new BigDecimal("50.00")) 
                .estado(LoteInversionista.Estado.ACTIVO)
                .build();

        // Inventario real con el costo congelado
        Inventario inventario = Inventario.builder()
                .id(1)
                .producto(producto)
                .loteInversionista(lote)
                .cantActualCajas(10)
                .costoCompraCaja(new BigDecimal("200000"))
                .build();
        when(inventarioRepository.findById(1)).thenReturn(Optional.of(inventario));

        // Setup Payload de Venta: Vendemos 1 caja a $250.000
        VentaDetalleDTO detalleDTO = new VentaDetalleDTO(
                1, 1, 0, 1, 0, 
                null, new BigDecimal("250000"), null, null
        );
        VentaDTO dto = new VentaDTO(1, null, null, Venta.MetodoPago.EFECTIVO, List.of(detalleDTO));

        when(ventaRepository.save(any(Venta.class))).thenAnswer(i -> i.getArguments()[0]);
        when(ventaDetalleRepository.save(any(VentaDetalle.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Venta venta = ventaService.registrarVenta(dto);

        // Assert Venta y Utilidades
        assertEquals(0, new BigDecimal("250000").compareTo(venta.getTotalVenta()));
        assertEquals(0, new BigDecimal("50000").compareTo(venta.getUtilidadBrutaTotal()));
        
        // Assert Inventario (10 - 1 = 9)
        assertEquals(9, inventario.getCantActualCajas());

        // Assert Amortización Automática (50% de $50.000 de utilidad = $25.000)
        // Saldo Final: 100.000 - 25.000 = 75.000
        assertEquals(0, new BigDecimal("75000").compareTo(lote.getSaldoPendiente()));
        verify(amortizacionDeudaRepository).save(any(AmortizacionDeuda.class));
    }
}
