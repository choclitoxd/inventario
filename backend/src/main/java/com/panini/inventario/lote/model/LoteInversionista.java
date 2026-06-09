package com.panini.inventario.lote.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lotes_proveedores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoteInversionista {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre_lote", nullable = false, length = 150)
    private String nombreLote;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Financiador financiador;

    @Column(name = "nombre_proveedor", length = 150)
    @JsonProperty("nombreProveedor")
    private String nombreInversionista;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonProperty("proveedor")
    private Inversionista inversionista;

    @Column(name = "monto_prestado", precision = 15, scale = 2)
    private BigDecimal montoPrestado;

    @Column(name = "saldo_pendiente", precision = 15, scale = 2)
    private BigDecimal saldoPendiente;

    @Column(name = "porcentaje_ganancia_amortizacion", precision = 5, scale = 2)
    private BigDecimal porcentajeGananciaAmortizacion;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "negocio_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private com.panini.inventario.negocio.model.Negocio negocio;

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
        if (estado == null) {
            estado = Estado.ACTIVO;
        }
    }

    public enum Financiador {
        DUENO_A, DUENO_B, INVERSIONISTA_EXTERNO
    }

    public enum Estado {
        ACTIVO, LIQUIDADO
    }
}
