package com.panini.inventario.lote.model;

import com.panini.inventario.venta.model.VentaDetalle;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "amortizaciones_deuda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmortizacionDeuda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lote_inversionista_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private LoteInversionista loteInversionista;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_detalle_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private VentaDetalle ventaDetalle;

    @Column(name = "monto_amortizado", nullable = false, precision = 15, scale = 2)
    private BigDecimal montoAmortizado;

    @Column(name = "fecha_amortizacion", updatable = false)
    private LocalDateTime fechaAmortizacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAmortizacion tipo;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @PrePersist
    protected void onCreate() {
        if (fechaAmortizacion == null) {
            fechaAmortizacion = LocalDateTime.now();
        }
    }

    public enum TipoAmortizacion {
        AUTOMATICA_VENTA, PAGO_MANUAL
    }
}
