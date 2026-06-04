package com.panini.inventario.lote.model.dto;

import com.panini.inventario.lote.model.LoteInversionista.Financiador;
import java.math.BigDecimal;

public record EntradaLoteDTO(
    String nombreLote,
    Financiador financiador,
    BigDecimal porcentajeGananciaAmortizacion,
    BigDecimal deudaInicial, 
    Integer productoId,
    Integer cantPacas,
    Integer cantCajas,
    Integer cantUnidades,
    BigDecimal costoCompraPaca,
    BigDecimal costoCompraCaja,
    BigDecimal costoCompraUnidad
) {}
