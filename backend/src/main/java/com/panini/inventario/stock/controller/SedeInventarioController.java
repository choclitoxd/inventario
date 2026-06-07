package com.panini.inventario.stock.controller;

import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.service.InventarioService;
import com.panini.inventario.stock.dto.SedeInventarioRequest;
import com.panini.inventario.stock.dto.SedeInventarioUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sedes/inventario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('DUENO')")
@SuppressWarnings("null")
public class SedeInventarioController {

    private final InventarioService inventarioService;

    @PostMapping
    public ResponseEntity<Inventario> vincularProducto(
            @RequestBody SedeInventarioRequest request,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        if (negocioId == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Inventario inv = inventarioService.vincularProductoInventario(request, negocioId, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(inv);
        } catch (IllegalArgumentException | com.panini.inventario.config.BusinessException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventario> actualizarInventario(
            @PathVariable Integer id,
            @RequestBody SedeInventarioUpdateRequest request,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        if (negocioId == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Inventario inv = inventarioService.actualizarInventarioSede(id, request, negocioId, username);
            return ResponseEntity.ok(inv);
        } catch (IllegalArgumentException | com.panini.inventario.config.BusinessException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarInventario(
            @PathVariable Integer id,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        if (negocioId == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            inventarioService.eliminarInventarioSede(id, negocioId, username);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | com.panini.inventario.config.BusinessException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    public record ErrorResponse(String message) {}
}
