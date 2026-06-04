package com.panini.inventario.stock.repository;

import com.panini.inventario.stock.model.RegistroCajaAbierta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroCajaAbiertaRepository extends JpaRepository<RegistroCajaAbierta, Integer> {
}
