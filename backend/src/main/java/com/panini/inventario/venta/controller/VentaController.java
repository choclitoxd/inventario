package com.panini.inventario.venta.controller;

import com.panini.inventario.venta.model.Venta;
import com.panini.inventario.venta.model.dto.VentaDTO;
import com.panini.inventario.venta.repository.VentaDetalleRepository;
import com.panini.inventario.venta.repository.VentaRepository;
import com.panini.inventario.venta.service.VentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class VentaController {

    private final VentaRepository ventaRepository;
    private final VentaDetalleRepository ventaDetalleRepository;
    private final VentaService ventaService;

    @GetMapping
    public List<Venta> listarVentas() {
        return ventaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Venta> registrarVenta(@RequestBody VentaDTO dto) {
        try {
            Venta venta = ventaService.registrarVenta(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(venta);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/sugerencia-precios")
    public ResponseEntity<SugerenciaPreciosDTO> obtenerPreciosSugeridos(@RequestParam Integer productoId) {
        PageRequest limit = PageRequest.of(0, 5);
        List<BigDecimal> pacas = ventaDetalleRepository.findSuggestedPricesPaca(productoId, limit);
        List<BigDecimal> cajas = ventaDetalleRepository.findSuggestedPricesCaja(productoId, limit);
        List<BigDecimal> unidades = ventaDetalleRepository.findSuggestedPricesUnidad(productoId, limit);

        return ResponseEntity.ok(new SugerenciaPreciosDTO(pacas, cajas, unidades));
    }

    public record SugerenciaPreciosDTO(
            List<BigDecimal> preciosPaca,
            List<BigDecimal> preciosCaja,
            List<BigDecimal> preciosUnidad
    ) {}
}
