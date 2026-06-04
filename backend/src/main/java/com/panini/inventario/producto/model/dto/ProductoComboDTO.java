package com.panini.inventario.producto.model.dto;

import java.util.List;

public record ProductoComboDTO(
    String nombreCombo,
    List<ComponenteDTO> componentes
) {
    public record ComponenteDTO(Integer productoId, Integer cantidadPacas, Integer cantidadCajas, Integer cantidadUnidades) {}
}
