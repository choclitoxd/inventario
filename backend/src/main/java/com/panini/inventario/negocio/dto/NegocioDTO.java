package com.panini.inventario.negocio.dto;

import java.util.List;

public record NegocioDTO(
    Integer id,
    String nombre,
    String duenos,
    List<Integer> duenoIds
) {}
