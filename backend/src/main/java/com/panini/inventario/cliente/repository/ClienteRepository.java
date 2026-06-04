package com.panini.inventario.cliente.repository;

import com.panini.inventario.cliente.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    List<Cliente> findByNegocioId(Integer negocioId);
    Optional<Cliente> findByTelefonoAndNegocioId(String telefono, Integer negocioId);
}
