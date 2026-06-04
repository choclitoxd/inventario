package com.panini.inventario.stock.repository;

import com.panini.inventario.stock.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
    List<Inventario> findByProductoId(Integer productoId);
    List<Inventario> findByLoteInversionistaId(Integer loteInversionistaId);
}
