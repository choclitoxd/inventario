package com.panini.inventario.lote.repository;

import com.panini.inventario.lote.model.Inversionista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InversionistaRepository extends JpaRepository<Inversionista, Integer> {
    List<Inversionista> findByNegocioId(Integer negocioId);
}
