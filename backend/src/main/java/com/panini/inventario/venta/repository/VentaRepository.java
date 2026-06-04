package com.panini.inventario.venta.repository;

import com.panini.inventario.venta.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {
    List<Venta> findByNegocioId(Integer negocioId);
}
