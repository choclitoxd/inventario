package com.panini.inventario.negocio.repository;

import com.panini.inventario.negocio.model.Negocio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NegocioRepository extends JpaRepository<Negocio, Integer> {
}
