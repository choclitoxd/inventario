package com.panini.inventario.producto.controller;

import com.panini.inventario.producto.model.ComboComposicion;
import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.model.dto.ProductoComboDTO;
import com.panini.inventario.producto.repository.ComboComposicionRepository;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.producto.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final ProductoService productoService;
    private final ComboComposicionRepository comboComposicionRepository;

    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        if (producto.getNombre() == null || producto.getNombre().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (producto.getTipo() == null) {
            return ResponseEntity.badRequest().build();
        }
        Producto guardado = productoRepository.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PostMapping("/combos")
    public ResponseEntity<Producto> crearCombo(@RequestBody ProductoComboDTO dto) {
        try {
            Producto combo = productoService.crearComboTemplate(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(combo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/composicion")
    public ResponseEntity<List<ComponenteResponseDTO>> obtenerComposicionCombo(@PathVariable Integer id) {
        Producto combo = productoRepository.findById(id).orElse(null);
        if (combo == null) {
            return ResponseEntity.notFound().build();
        }

        List<ComboComposicion> composiciones = comboComposicionRepository.findByComboId(id);
        if (composiciones.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<ComponenteResponseDTO> response = composiciones.stream()
                .map(comp -> new ComponenteResponseDTO(
                        comp.getId(),
                        comp.getProductoComponente().getId(),
                        comp.getProductoComponente().getNombre(),
                        comp.getCantidadPacas(),
                        comp.getCantidadCajas(),
                        comp.getCantidadUnidades()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    public record ComponenteResponseDTO(
            Integer id,
            Integer productoComponenteId,
            String productoComponenteNombre,
            Integer cantidadPacas,
            Integer cantidadCajas,
            Integer cantidadUnidades
    ) {}
}
