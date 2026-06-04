package com.panini.inventario.venta.model.dto;

import com.panini.inventario.venta.model.Venta.MetodoPago;
import java.util.List;

public record VentaDTO(
    Integer clienteId,
    String clienteNombre,
    String clienteTelefono,
    MetodoPago metodoPago,
    List<VentaDetalleDTO> detalles
) {}
