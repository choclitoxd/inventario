package com.panini.inventario.stock.model;

import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.lote.model.LoteInversionista;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lote_inversionista_id", nullable = false)
    private LoteInversionista loteInversionista;

    @Column(name = "cant_inicial_pacas")
    private Integer cantInicialPacas;

    @Column(name = "cant_inicial_cajas")
    private Integer cantInicialCajas;

    @Column(name = "cant_inicial_unidades")
    private Integer cantInicialUnidades;

    @Column(name = "cant_actual_pacas")
    private Integer cantActualPacas;

    @Column(name = "cant_actual_cajas")
    private Integer cantActualCajas;

    @Column(name = "cant_actual_unidades")
    private Integer cantActualUnidades;

    @Column(name = "costo_compra_paca", precision = 15, scale = 2)
    private BigDecimal costoCompraPaca;

    @Column(name = "costo_compra_caja", precision = 15, scale = 2)
    private BigDecimal costoCompraCaja;

    @Column(name = "costo_compra_unidad", precision = 15, scale = 2)
    private BigDecimal costoCompraUnidad;

    @Column(name = "fecha_ingreso", updatable = false)
    private LocalDateTime fechaIngreso;

    @PrePersist
    protected void onCreate() {
        if (fechaIngreso == null) {
            fechaIngreso = LocalDateTime.now();
        }
    }
}
