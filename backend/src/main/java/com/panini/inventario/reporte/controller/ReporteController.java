package com.panini.inventario.reporte.controller;

import com.panini.inventario.reporte.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/resumen")
    public ReporteService.ResumenFinancieroDTO obtenerResumen(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return reporteService.obtenerResumen(desde, hasta);
    }

    @GetMapping("/capital-segmentado")
    public List<ReporteService.CapitalSegmentadoDTO> obtenerCapitalSegmentado() {
        return reporteService.obtenerCapitalSegmentado();
    }

    @GetMapping("/fluctuacion-precios")
    public List<ReporteService.FluctuacionPrecioDTO> obtenerFluctuacionPrecios() {
        return reporteService.obtenerFluctuacionPrecios();
    }
}
