package com.panini.inventario.lote.repository;

import com.panini.inventario.lote.model.ProveedorTarifa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProveedorTarifaRepository extends JpaRepository<ProveedorTarifa, Integer> {
    List<ProveedorTarifa> findByNegocioId(Integer negocioId);
    List<ProveedorTarifa> findByProveedorIdAndNegocioId(Integer proveedorId, Integer negocioId);
    Optional<ProveedorTarifa> findByProveedorIdAndProductoIdAndNegocioId(Integer proveedorId, Integer productoId, Integer negocioId);
}
