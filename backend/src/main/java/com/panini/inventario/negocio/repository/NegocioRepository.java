package com.panini.inventario.negocio.repository;

import com.panini.inventario.negocio.model.Negocio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NegocioRepository extends JpaRepository<Negocio, Integer> {

    @Query("SELECT n FROM Negocio n WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(n.nombre) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:dueno IS NULL OR :dueno = '' OR LOWER(n.duenos) LIKE LOWER(CONCAT('%', :dueno, '%')))")
    List<Negocio> buscarConFiltros(@Param("search") String search, @Param("dueno") String dueno);
}
