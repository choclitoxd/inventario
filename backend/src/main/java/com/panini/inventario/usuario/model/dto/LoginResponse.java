package com.panini.inventario.usuario.model.dto;

public record LoginResponse(
    Integer id,
    String username,
    String nombre,
    String rol
) {}
