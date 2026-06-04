package com.panini.inventario.negocio.controller;

import com.panini.inventario.negocio.model.Negocio;
import com.panini.inventario.negocio.repository.NegocioRepository;
import com.panini.inventario.auditoria.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/negocios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NegocioController {

    private final NegocioRepository negocioRepository;
    private final AuditoriaService auditoriaService;

    @GetMapping
    public List<Negocio> listarNegocios() {
        return negocioRepository.findAll();
    }

    @PostMapping
    public Negocio crearNegocio(
            @RequestBody Negocio negocio,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        Negocio saved = negocioRepository.save(negocio);
        auditoriaService.registrarAccion(username, "CREAR_NEGOCIO", "Se creó el negocio: " + saved.getNombre() + " (ID: " + saved.getId() + ")", saved.getId());
        return saved;
    }
}
