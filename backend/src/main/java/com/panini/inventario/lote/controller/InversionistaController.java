package com.panini.inventario.lote.controller;

import com.panini.inventario.lote.model.Inversionista;
import com.panini.inventario.lote.repository.InversionistaRepository;
import com.panini.inventario.lote.service.ProveedorService;
import com.panini.inventario.negocio.model.Negocio;
import com.panini.inventario.negocio.repository.NegocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('DUENO')")
@SuppressWarnings("null")
public class InversionistaController {

    private final InversionistaRepository inversionistaRepository;
    private final NegocioRepository negocioRepository;
    private final ProveedorService proveedorService;

    @GetMapping
    public List<Inversionista> listar() {
        return proveedorService.listarProveedores();
    }

    @PostMapping
    public ResponseEntity<Inversionista> registrar(
            @RequestBody Inversionista request,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));
        
        Inversionista inversionista = Inversionista.builder()
                .nombre(request.getNombre())
                .telefono(request.getTelefono())
                .negocio(negocio)
                .build();
                
        return ResponseEntity.status(HttpStatus.CREATED).body(inversionistaRepository.save(inversionista));
    }
}
