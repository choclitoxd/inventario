package com.panini.inventario.gasto.model;

import com.panini.inventario.lote.model.LoteInversionista;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "gastos_hormiga")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GastoHormiga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monto;

    @Column(name = "fecha_gasto", updatable = false)
    private LocalDateTime fechaGasto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoriaGasto categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lote_inversionista_id")
    private LoteInversionista loteInversionista;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "negocio_id", nullable = false)
    private com.panini.inventario.negocio.model.Negocio negocio;

    @PrePersist
    protected void onCreate() {
        if (fechaGasto == null) {
            fechaGasto = LocalDateTime.now();
        }
    }

    public enum CategoriaGasto {
        FLETE, TRANSPORTE, ALIMENTACION, OTRO
    }
}
