package com.panini.inventario.lote.controller;

import com.panini.inventario.lote.model.ProveedorTarifa;
import com.panini.inventario.lote.repository.ProveedorTarifaRepository;
import com.panini.inventario.lote.repository.InversionistaRepository;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.negocio.repository.NegocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/proveedores/tarifas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('DUENO')")
@SuppressWarnings("null")
public class ProveedorTarifaController {

    private final ProveedorTarifaRepository proveedorTarifaRepository;
    private final InversionistaRepository inversionistaRepository;
    private final ProductoRepository productoRepository;
    private final NegocioRepository negocioRepository;

    @GetMapping
    public List<ProveedorTarifa> listar(@RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return List.of();
        }
        return proveedorTarifaRepository.findByNegocioId(negocioId);
    }

    @GetMapping("/proveedor/{proveedorId}")
    public List<ProveedorTarifa> listarPorProveedor(
            @PathVariable Integer proveedorId,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return List.of();
        }
        return proveedorTarifaRepository.findByProveedorIdAndNegocioId(proveedorId, negocioId);
    }

    @PostMapping
    public ResponseEntity<ProveedorTarifa> guardar(
            @RequestBody TarifaDTO dto,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        var negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));
        var proveedor = inversionistaRepository.findById(dto.proveedorId())
                .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado con ID: " + dto.proveedorId()));
        var producto = productoRepository.findById(dto.productoId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + dto.productoId()));

        var existing = proveedorTarifaRepository.findByProveedorIdAndProductoIdAndNegocioId(dto.proveedorId(), dto.productoId(), negocioId);
        ProveedorTarifa tarifa;
        if (existing.isPresent()) {
            tarifa = existing.get();
            tarifa.setCostoPactado(dto.costoPactado());
        } else {
            tarifa = ProveedorTarifa.builder()
                    .proveedor(proveedor)
                    .producto(producto)
                    .costoPactado(dto.costoPactado())
                    .negocio(negocio)
                    .build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(proveedorTarifaRepository.save(tarifa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return ResponseEntity.badRequest().build();
        }
        proveedorTarifaRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    public record TarifaDTO(Integer proveedorId, Integer productoId, BigDecimal costoPactado) {}
}
