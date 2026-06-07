package com.panini.inventario.lote.controller;

import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.model.dto.EntradaLoteDTO;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.lote.service.AmortizacionDeudaService;
import com.panini.inventario.lote.service.LoteService;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.auditoria.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/lotes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('DUENO')")
@SuppressWarnings("null")
public class LoteController {

    private final LoteInversionistaRepository loteInversionistaRepository;
    private final LoteService loteService;
    private final AmortizacionDeudaService amortizacionDeudaService;
    private final AuditoriaService auditoriaService;

    @GetMapping
    public List<LoteInversionista> listarLotes(@RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return List.of();
        }
        return loteInversionistaRepository.findByNegocioId(negocioId);
    }

    @GetMapping("/inversionistas/deudas")
    public List<LoteInversionista> listarDeudasInversionistas(@RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return List.of();
        }
        return loteInversionistaRepository.findByFinanciadorAndNegocioId(LoteInversionista.Financiador.INVERSIONISTA_EXTERNO, negocioId);
    }

    @PostMapping
    public ResponseEntity<Inventario> registrarEntradaLote(
            @RequestBody EntradaLoteDTO dto,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        if (negocioId == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Inventario inventario = loteService.registrarEntradaLote(dto, negocioId);
            auditoriaService.registrarAccion(username, "REGISTRAR_LOTE", "Se registró entrada del lote: " + inventario.getLoteInversionista().getNombreLote() + " (Producto: " + inventario.getProducto().getNombre() + ", Financiador: " + inventario.getLoteInversionista().getFinanciador() + ")", negocioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(inventario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/amortizar")
    public ResponseEntity<Void> registrarAbonoManual(
            @PathVariable Integer id,
            @RequestBody AmortizacionManualRequest request,
            @RequestHeader(value = "X-User-Username", required = false) String username) {
        try {
            LoteInversionista lote = loteInversionistaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Lote no encontrado"));
            amortizacionDeudaService.registrarAbonoManual(id, request.monto(), request.notas());
            auditoriaService.registrarAccion(username, "ABONO_MANUAL_DEUDA", "Se pagó abono manual de $" + request.monto() + " a la deuda del lote: " + lote.getNombreLote() + " (Notas: " + request.notas() + ")", lote.getNegocio().getId());
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
