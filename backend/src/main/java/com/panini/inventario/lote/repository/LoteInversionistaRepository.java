package com.panini.inventario.lote.repository;

import com.panini.inventario.lote.model.LoteInversionista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoteInversionistaRepository extends JpaRepository<LoteInversionista, Integer> {
    List<LoteInversionista> findByNegocioId(Integer negocioId);
    List<LoteInversionista> findByFinanciadorAndNegocioId(LoteInversionista.Financiador financiador, Integer negocioId);
    List<LoteInversionista> findByFinanciadorAndEstadoAndNegocioId(LoteInversionista.Financiador financiador, LoteInversionista.Estado estado, Integer negocioId);
    long countByNegocioId(Integer negocioId);
}
