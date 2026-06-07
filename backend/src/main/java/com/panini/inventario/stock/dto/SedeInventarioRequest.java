package com.panini.inventario.stock.dto;

import java.math.BigDecimal;

public record SedeInventarioRequest(
        Integer productoId,
        Integer loteId,
        Integer cantPacas,
        Integer cantCajas,
        Integer cantUnidades,
        BigDecimal costoCompraPaca,
        BigDecimal costoCompraCaja,
        BigDecimal costoCompraUnidad
) {}
