package com.panini.inventario.producto.controller;

import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.venta.repository.VentaDetalleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class AdminProductoController {

    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final VentaDetalleRepository ventaDetalleRepository;

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> actualizarProducto(@PathVariable Integer id, @RequestBody Producto productoDetails) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }

        if (productoDetails.getNombre() == null || productoDetails.getNombre().isBlank()) {
            return ResponseEntity.badRequest().body("El nombre del producto no puede estar vacío.");
        }

        producto.setNombre(productoDetails.getNombre());
        producto.setEdicionColeccion(productoDetails.getEdicionColeccion());
        producto.setCodigoBarras(productoDetails.getCodigoBarras());
        
        if (productoDetails.getPrecioSugeridoDefecto() != null) {
            producto.setPrecioSugeridoDefecto(productoDetails.getPrecioSugeridoDefecto());
        }

        if (productoDetails.getFactorConversion() != null) {
            producto.setFactorConversion(productoDetails.getFactorConversion());
        }

        Producto guardado = productoRepository.save(producto);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> eliminarProducto(@PathVariable Integer id) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }

        // 1. Validar que no tenga registros de ventas
        long countVentas = ventaDetalleRepository.countByProductoId(id);
        if (countVentas > 0) {
            return ResponseEntity.badRequest().body("No se puede eliminar el producto porque tiene historial de ventas asociado.");
        }

        // 2. Validar que no tenga existencias activas (stock > 0) en ningún negocio
        List<Inventario> inventarios = inventarioRepository.findByProductoId(id);
        for (Inventario inv : inventarios) {
            int stock = (inv.getCantActualPacas() != null ? inv.getCantActualPacas() : 0) +
                        (inv.getCantActualCajas() != null ? inv.getCantActualCajas() : 0) +
                        (inv.getCantActualUnidades() != null ? inv.getCantActualUnidades() : 0);
            if (stock > 0) {
                return ResponseEntity.badRequest().body("No se puede eliminar el producto porque tiene existencias activas en inventario.");
            }
        }

        // 3. Si el stock es 0, eliminamos físicamente los registros de Inventario vacíos para evitar violación de llave foránea
        if (!inventarios.isEmpty()) {
            inventarioRepository.deleteAll(inventarios);
        }

        // 4. Eliminar el producto del catálogo maestro
        productoRepository.delete(producto);
        return ResponseEntity.ok().build();
    }
}
