package com.panini.inventario.stock.repository;

import com.panini.inventario.stock.model.RegistroCajaAbierta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroCajaAbiertaRepository extends JpaRepository<RegistroCajaAbierta, Integer> {
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM RegistroCajaAbierta r WHERE r.inventario.id = :inventarioId")
    void deleteByInventarioId(Integer inventarioId);
}
