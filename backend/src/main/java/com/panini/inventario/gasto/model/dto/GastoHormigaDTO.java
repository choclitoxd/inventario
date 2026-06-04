package com.panini.inventario.gasto.model.dto;

import com.panini.inventario.gasto.model.GastoHormiga.CategoriaGasto;
import java.math.BigDecimal;

public record GastoHormigaDTO(
    String descripcion,
    BigDecimal monto,
    CategoriaGasto categoria,
    Integer loteInversionistaId
) {}
