package com.panini.inventario.gasto.repository;

import com.panini.inventario.gasto.model.GastoHormiga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GastoHormigaRepository extends JpaRepository<GastoHormiga, Integer> {
    List<GastoHormiga> findByNegocioId(Integer negocioId);
}
