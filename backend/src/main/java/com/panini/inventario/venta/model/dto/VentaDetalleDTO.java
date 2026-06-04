package com.panini.inventario.venta.model.dto;

import java.math.BigDecimal;
import java.util.List;

public record VentaDetalleDTO(
    Integer inventarioId, 
    Integer productoId,
    Integer cantidadPacas,
    Integer cantidadCajas,
    Integer cantidadUnidades,
    BigDecimal precioVentaPaca,
    BigDecimal precioVentaCaja,
    BigDecimal precioVentaUnidad,
    List<VentaDetalleDTO> componentesCombo
) {}
