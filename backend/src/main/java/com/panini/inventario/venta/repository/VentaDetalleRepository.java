package com.panini.inventario.venta.repository;

import com.panini.inventario.venta.model.VentaDetalle;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VentaDetalleRepository extends JpaRepository<VentaDetalle, Integer> {
    List<VentaDetalle> findByVentaId(Integer ventaId);

    @Query("SELECT vd.precioVentaPaca FROM VentaDetalle vd WHERE vd.producto.id = :productoId AND vd.precioVentaPaca IS NOT NULL GROUP BY vd.precioVentaPaca ORDER BY COUNT(vd) DESC")
    List<BigDecimal> findSuggestedPricesPaca(Integer productoId, Pageable pageable);

    @Query("SELECT vd.precioVentaCaja FROM VentaDetalle vd WHERE vd.producto.id = :productoId AND vd.precioVentaCaja IS NOT NULL GROUP BY vd.precioVentaCaja ORDER BY COUNT(vd) DESC")
    List<BigDecimal> findSuggestedPricesCaja(Integer productoId, Pageable pageable);

    @Query("SELECT vd.precioVentaUnidad FROM VentaDetalle vd WHERE vd.producto.id = :productoId AND vd.precioVentaUnidad IS NOT NULL GROUP BY vd.precioVentaUnidad ORDER BY COUNT(vd) DESC")
    List<BigDecimal> findSuggestedPricesUnidad(Integer productoId, Pageable pageable);
}
