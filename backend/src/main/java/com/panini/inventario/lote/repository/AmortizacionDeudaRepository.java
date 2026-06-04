package com.panini.inventario.lote.repository;

import com.panini.inventario.lote.model.AmortizacionDeuda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AmortizacionDeudaRepository extends JpaRepository<AmortizacionDeuda, Integer> {
    List<AmortizacionDeuda> findByLoteInversionistaId(Integer loteInversionistaId);
}
