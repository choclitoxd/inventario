package com.panini.inventario.producto.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipo tipo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "edicion_coleccion", length = 150)
    private String edicionColeccion;

    @Column(name = "codigo_barras", length = 100)
    private String codigoBarras;

    @Column(name = "precio_sugerido_defecto", precision = 15, scale = 2)
    private BigDecimal precioSugeridoDefecto;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }

    public enum Tipo {
        FRACCIONADO_COMPLEJO, UNIDADES_SIMPLES
    }
}
