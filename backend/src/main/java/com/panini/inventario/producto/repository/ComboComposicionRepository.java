package com.panini.inventario.producto.repository;

import com.panini.inventario.producto.model.ComboComposicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComboComposicionRepository extends JpaRepository<ComboComposicion, Integer> {
    List<ComboComposicion> findByComboId(Integer comboId);
}
