package com.panini.inventario.usuario.controller;

import com.panini.inventario.usuario.model.Usuario;
import com.panini.inventario.usuario.model.dto.LoginRequest;
import com.panini.inventario.usuario.model.dto.LoginResponse;
import com.panini.inventario.usuario.repository.UsuarioRepository;
import com.panini.inventario.auditoria.repository.AuditoriaRepository;
import com.panini.inventario.auditoria.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final AuditoriaRepository auditoriaRepository;
    private final AuditoriaService auditoriaService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.username() == null || request.password() == null) {
            return ResponseEntity.badRequest().body("Usuario y contraseña son requeridos");
        }
        
        var userOpt = usuarioRepository.findByUsername(request.username().trim().toLowerCase());
        if (userOpt.isPresent()) {
            Usuario u = userOpt.get();
            if (u.getPassword().equals(request.password())) {
                return ResponseEntity.ok(new LoginResponse(u.getId(), u.getUsername(), u.getNombre(), u.getRol()));
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crearUsuario(
            @RequestBody Usuario usuario,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        if (usuario.getUsername() == null || usuario.getPassword() == null || usuario.getRol() == null) {
            return ResponseEntity.badRequest().body("Datos incompletos para crear el usuario");
        }
        usuario.setUsername(usuario.getUsername().trim().toLowerCase());
        if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya está registrado");
        }
        Usuario saved = usuarioRepository.save(usuario);
        auditoriaService.registrarAccion(username, "CREAR_USUARIO", "Se creó el usuario: " + saved.getUsername() + " (Rol: " + saved.getRol() + ")", null);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(
            @PathVariable Integer id,
            @RequestBody Usuario usuarioDetalles,
            @RequestHeader(value = "X-User-Username", required = false) String sessionUsername) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        usuario.setNombre(usuarioDetalles.getNombre());
        usuario.setRol(usuarioDetalles.getRol());

        if (usuarioDetalles.getPassword() != null && !usuarioDetalles.getPassword().isBlank()) {
            usuario.setPassword(usuarioDetalles.getPassword());
        }

        Usuario updated = usuarioRepository.save(usuario);
        auditoriaService.registrarAccion(sessionUsername, "ACTUALIZAR_USUARIO", 
                "Se actualizó el usuario: " + updated.getUsername() + " (Rol: " + updated.getRol() + ")", null);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Username", required = false) String sessionUsername) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        if (usuario.getUsername().equals(sessionUsername)) {
            return ResponseEntity.badRequest().body(new ErrorResponse("No puedes auto-eliminar tu propia cuenta de usuario activa."));
        }

        long auditCount = auditoriaRepository.countByUsuario(usuario.getUsername());
        if (auditCount > 0) {
            return ResponseEntity.badRequest().body(new ErrorResponse("No se puede eliminar el usuario porque tiene registros de actividad en la bitácora de auditoría."));
        }

        usuarioRepository.delete(usuario);
        auditoriaService.registrarAccion(sessionUsername, "ELIMINAR_USUARIO", 
                "Se eliminó el usuario: " + usuario.getUsername(), null);
        return ResponseEntity.noContent().build();
    }

    public record ErrorResponse(String message) {}
}
