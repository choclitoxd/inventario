package com.panini.inventario.venta.model;

import com.panini.inventario.cliente.model.Cliente;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "fecha_venta", updatable = false)
    private LocalDateTime fechaVenta;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private MetodoPago metodoPago;

    @Column(name = "total_venta", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalVenta;

    @Column(name = "utilidad_bruta_total", precision = 15, scale = 2, nullable = false)
    private BigDecimal utilidadBrutaTotal;

    @PrePersist
    protected void onCreate() {
        if (fechaVenta == null) {
            fechaVenta = LocalDateTime.now();
        }
    }

    public enum MetodoPago {
        EFECTIVO, TRANSFERENCIA
    }
}
