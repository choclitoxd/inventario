package com.panini.inventario.lote.model.dto;

import com.panini.inventario.lote.model.LoteInversionista.Financiador;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record EntradaLoteDTO(
    String nombreLote,
    Financiador financiador,
    @JsonProperty("proveedorId") Integer inversionistaId,
    BigDecimal montoPrestado,
    BigDecimal porcentajeGananciaAmortizacion
) {}
