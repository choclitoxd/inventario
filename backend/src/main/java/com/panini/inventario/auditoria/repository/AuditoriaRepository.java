package com.panini.inventario.auditoria.repository;

import com.panini.inventario.auditoria.model.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditoriaRepository extends JpaRepository<Auditoria, Integer> {
    List<Auditoria> findAllByOrderByFechaDesc();
    List<Auditoria> findByNegocioIdOrderByFechaDesc(Integer negocioId);
}
