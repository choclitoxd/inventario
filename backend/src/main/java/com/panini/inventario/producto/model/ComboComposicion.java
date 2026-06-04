package com.panini.inventario.producto.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "combos_composicion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComboComposicion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id", nullable = false)
    private Producto combo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_componente_id", nullable = false)
    private Producto productoComponente;

    @Column(name = "cantidad_pacas")
    private Integer cantidadPacas;

    @Column(name = "cantidad_cajas")
    private Integer cantidadCajas;

    @Column(name = "cantidad_unidades")
    private Integer cantidadUnidades;
}
