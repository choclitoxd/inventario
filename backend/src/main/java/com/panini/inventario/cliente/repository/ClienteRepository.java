package com.panini.inventario.cliente.repository;

import com.panini.inventario.cliente.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    List<Cliente> findByNegocioId(Integer negocioId);
    Optional<Cliente> findByTelefonoAndNegocioId(String telefono, Integer negocioId);
    long countByNegocioId(Integer negocioId);

    @Query("SELECT c FROM Cliente c WHERE c.negocio.id = :negocioId AND (c.nombre LIKE %:query% OR c.telefono LIKE %:query%)")
    List<Cliente> searchClientes(@Param("query") String query, @Param("negocioId") Integer negocioId, Pageable pageable);
}
