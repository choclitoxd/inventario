package com.panini.inventario.negocio.controller;

import com.panini.inventario.negocio.model.Negocio;
import com.panini.inventario.negocio.repository.NegocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/negocios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NegocioController {

    private final NegocioRepository negocioRepository;

    @GetMapping
    public List<Negocio> listarNegocios() {
        return negocioRepository.findAll();
    }
}
