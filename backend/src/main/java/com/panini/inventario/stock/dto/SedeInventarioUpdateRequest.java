package com.panini.inventario.stock.dto;

import java.math.BigDecimal;

public record SedeInventarioUpdateRequest(
        Integer cantActualPacas,
        Integer cantActualCajas,
        Integer cantActualUnidades,
        BigDecimal costoCompraPaca,
        BigDecimal costoCompraCaja,
        BigDecimal costoCompraUnidad
) {}
