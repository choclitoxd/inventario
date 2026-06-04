package com.panini.inventario.stock.controller;

import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.stock.service.InventarioService;
import com.panini.inventario.auditoria.service.AuditoriaService;
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
    private final AuditoriaService auditoriaService;

    @GetMapping
    public List<Inventario> listarInventario(@RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return List.of();
        }
        return inventarioRepository.findByLoteInversionistaNegocioId(negocioId);
    }

    @PostMapping("/{id}/abrir-caja")
    public ResponseEntity<Inventario> abrirCaja(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        try {
            Inventario inventario = inventarioService.abrirCaja(id);
            auditoriaService.registrarAccion(username, "ABRIR_CAJA", "Se abrió 1 caja de: " + inventario.getProducto().getNombre() + " (+104 sobres, lote: " + inventario.getLoteInversionista().getNombreLote() + ")", inventario.getLoteInversionista().getNegocio().getId());
            return ResponseEntity.ok(inventario);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{id}/abrir-paca-laminas")
    public ResponseEntity<Void> abrirPacaLaminas(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        try {
            Inventario inventario = inventarioRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado"));
            inventarioService.abrirPacaLaminas(id);
            auditoriaService.registrarAccion(username, "ABRIR_PACA_LAMINAS", "Se abrió 1 paca de láminas de: " + inventario.getProducto().getNombre() + " (+10 cajas, lote: " + inventario.getLoteInversionista().getNombreLote() + ")", inventario.getLoteInversionista().getNegocio().getId());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/abrir-paca-albumes")
    public ResponseEntity<Void> abrirPacaAlbumes(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        try {
            Inventario inventario = inventarioRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado"));
            inventarioService.abrirPacaAlbumes(id);
            auditoriaService.registrarAccion(username, "ABRIR_PACA_ALBUMES", "Se abrió 1 paca de álbumes de: " + inventario.getProducto().getNombre() + " (+26 álbumes, lote: " + inventario.getLoteInversionista().getNombreLote() + ")", inventario.getLoteInversionista().getNegocio().getId());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
