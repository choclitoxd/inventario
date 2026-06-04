package com.panini.inventario.usuario.controller;

import com.panini.inventario.usuario.model.Usuario;
import com.panini.inventario.usuario.model.dto.LoginRequest;
import com.panini.inventario.usuario.model.dto.LoginResponse;
import com.panini.inventario.usuario.repository.UsuarioRepository;
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
}
