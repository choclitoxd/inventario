package com.panini.inventario.stock.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registro_cajas_abiertas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroCajaAbierta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventario_id", nullable = false)
    private Inventario inventario;

    @Column(name = "cantidad_cajas", nullable = false)
    private Integer cantidadCajas;

    @Column(name = "sobres_adicionados", nullable = false)
    private Integer sobresAdicionados;

    @Column(name = "fecha_apertura", updatable = false)
    private LocalDateTime fechaApertura;

    @PrePersist
    protected void onCreate() {
        if (fechaApertura == null) {
            fechaApertura = LocalDateTime.now();
        }
    }
}
