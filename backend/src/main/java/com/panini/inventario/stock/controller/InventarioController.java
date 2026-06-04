package com.panini.inventario.stock.controller;

import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.stock.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class InventarioController {

    private final InventarioRepository inventarioRepository;
    private final InventarioService inventarioService;

    @GetMapping
    public List<Inventario> listarInventario(@RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return List.of();
        }
        return inventarioRepository.findByLoteInversionistaNegocioId(negocioId);
    }

    @PostMapping("/{id}/abrir-caja")
    public ResponseEntity<Inventario> abrirCaja(@PathVariable Integer id) {
        try {
            Inventario inventario = inventarioService.abrirCaja(id);
            return ResponseEntity.ok(inventario);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{id}/abrir-paca-laminas")
    public ResponseEntity<Void> abrirPacaLaminas(@PathVariable Integer id) {
        try {
            inventarioService.abrirPacaLaminas(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/abrir-paca-albumes")
    public ResponseEntity<Void> abrirPacaAlbumes(@PathVariable Integer id) {
        try {
            inventarioService.abrirPacaAlbumes(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
