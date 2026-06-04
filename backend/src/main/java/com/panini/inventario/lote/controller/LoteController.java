package com.panini.inventario.lote.controller;

import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.model.dto.EntradaLoteDTO;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.lote.service.AmortizacionDeudaService;
import com.panini.inventario.lote.service.LoteService;
import com.panini.inventario.stock.model.Inventario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/lotes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class LoteController {

    private final LoteInversionistaRepository loteInversionistaRepository;
    private final LoteService loteService;
    private final AmortizacionDeudaService amortizacionDeudaService;

    @GetMapping
    public List<LoteInversionista> listarLotes() {
        return loteInversionistaRepository.findAll();
    }

    @GetMapping("/inversionistas/deudas")
    public List<LoteInversionista> listarDeudasInversionistas() {
        return loteInversionistaRepository.findByFinanciador(LoteInversionista.Financiador.INVERSIONISTA_EXTERNO);
    }

    @PostMapping
    public ResponseEntity<Inventario> registrarEntradaLote(@RequestBody EntradaLoteDTO dto) {
        try {
            Inventario inventario = loteService.registrarEntradaLote(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(inventario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/amortizar")
    public ResponseEntity<Void> registrarAbonoManual(
            @PathVariable Integer id,
            @RequestBody AmortizacionManualRequest request) {
        try {
            amortizacionDeudaService.registrarAbonoManual(id, request.monto(), request.notas());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    public record AmortizacionManualRequest(
            BigDecimal monto,
            String notas
    ) {}
}
