package com.panini.inventario.venta.model;

import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.stock.model.Inventario;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "venta_detalles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Venta venta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventario_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Inventario inventario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_detalle_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private VentaDetalle parentDetalle;

    @Column(name = "cantidad_pacas")
    private Integer cantidadPacas;

    @Column(name = "cantidad_cajas")
    private Integer cantidadCajas;

    @Column(name = "cantidad_unidades")
    private Integer cantidadUnidades;

    @Column(name = "precio_venta_paca", precision = 15, scale = 2)
    private BigDecimal precioVentaPaca;

    @Column(name = "precio_venta_caja", precision = 15, scale = 2)
    private BigDecimal precioVentaCaja;

    @Column(name = "precio_venta_unidad", precision = 15, scale = 2)
    private BigDecimal precioVentaUnidad;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "costo_total", nullable = false, precision = 15, scale = 2)
    private BigDecimal costoTotal;

    @Column(name = "utilidad_neta", nullable = false, precision = 15, scale = 2)
    private BigDecimal utilidadNeta;

    @Column(name = "monto_amortizado_inversionista", precision = 15, scale = 2)
    private BigDecimal montoAmortizadoInversionista;
}
