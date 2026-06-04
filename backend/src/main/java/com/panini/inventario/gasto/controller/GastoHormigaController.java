package com.panini.inventario.gasto.controller;

import com.panini.inventario.gasto.model.GastoHormiga;
import com.panini.inventario.gasto.model.dto.GastoHormigaDTO;
import com.panini.inventario.gasto.repository.GastoHormigaRepository;
import com.panini.inventario.gasto.service.GastoHormigaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class GastoHormigaController {

    private final GastoHormigaRepository gastoHormigaRepository;
    private final GastoHormigaService gastoHormigaService;

    @GetMapping
    public List<GastoHormiga> listarGastos() {
        return gastoHormigaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<GastoHormiga> registrarGasto(@RequestBody GastoHormigaDTO dto) {
        try {
            GastoHormiga gasto = gastoHormigaService.registrarGasto(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(gasto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
