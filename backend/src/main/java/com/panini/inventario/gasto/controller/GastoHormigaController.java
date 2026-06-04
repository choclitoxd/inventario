package com.panini.inventario.gasto.controller;

import com.panini.inventario.gasto.model.GastoHormiga;
import com.panini.inventario.gasto.model.dto.GastoHormigaDTO;
import com.panini.inventario.gasto.repository.GastoHormigaRepository;
import com.panini.inventario.gasto.service.GastoHormigaService;
import com.panini.inventario.auditoria.service.AuditoriaService;
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
    private final AuditoriaService auditoriaService;

    @GetMapping
    public List<GastoHormiga> listarGastos(@RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return List.of();
        }
        return gastoHormigaRepository.findByNegocioId(negocioId);
    }

    @PostMapping
    public ResponseEntity<GastoHormiga> registrarGasto(
            @RequestBody GastoHormigaDTO dto,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        if (negocioId == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            GastoHormiga gasto = gastoHormigaService.registrarGasto(dto, negocioId);
            auditoriaService.registrarAccion(username, "REGISTRAR_GASTO", "Se registró el gasto: " + gasto.getDescripcion() + " por $" + gasto.getMonto() + " (Categoría: " + gasto.getCategoria() + ")", negocioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(gasto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
