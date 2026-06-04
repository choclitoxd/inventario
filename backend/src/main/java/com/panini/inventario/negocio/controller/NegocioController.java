package com.panini.inventario.negocio.controller;

import com.panini.inventario.negocio.dto.NegocioDTO;
import com.panini.inventario.negocio.service.NegocioService;
import com.panini.inventario.auditoria.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/negocios", "/api/admin/sedes"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NegocioController {

    private final NegocioService negocioService;
    private final AuditoriaService auditoriaService;

    @GetMapping
    public List<NegocioDTO> listarNegocios(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "duenoId", required = false) Integer duenoId,
            @RequestParam(value = "dueno", required = false) String dueno) {
        return negocioService.buscarNegocios(search, duenoId, dueno);
    }

    @PostMapping
    public ResponseEntity<NegocioDTO> crearNegocio(
            @RequestBody NegocioDTO negocioDTO,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        if (negocioDTO.nombre() == null || negocioDTO.nombre().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        NegocioDTO saved = negocioService.crearNegocio(negocioDTO);
        auditoriaService.registrarAccion(username, "CREAR_NEGOCIO", 
                "Se creó el negocio: " + saved.nombre() + " (ID: " + saved.id() + ")", saved.id());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NegocioDTO> actualizarNegocio(
            @PathVariable Integer id,
            @RequestBody NegocioDTO negocioDTO,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        if (negocioDTO.nombre() == null || negocioDTO.nombre().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            NegocioDTO updated = negocioService.actualizarNegocio(id, negocioDTO);
            auditoriaService.registrarAccion(username, "ACTUALIZAR_NEGOCIO", 
                    "Se actualizó el negocio: " + updated.nombre() + " (ID: " + updated.id() + ")", updated.id());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarNegocio(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        try {
            negocioService.eliminarNegocio(id);
            auditoriaService.registrarAccion(username, "ELIMINAR_NEGOCIO", 
                    "Se eliminó el negocio con ID: " + id, null);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    public record ErrorResponse(String message) {}
}
