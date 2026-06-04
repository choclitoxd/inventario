package com.panini.inventario.auditoria.controller;

import com.panini.inventario.auditoria.model.Auditoria;
import com.panini.inventario.auditoria.repository.AuditoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditoriaController {

    private final AuditoriaRepository auditoriaRepository;

    @GetMapping
    public List<Auditoria> listarAuditoria(@RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId != null) {
            return auditoriaRepository.findByNegocioIdOrderByFechaDesc(negocioId);
        }
        return auditoriaRepository.findAllByOrderByFechaDesc();
    }
}
