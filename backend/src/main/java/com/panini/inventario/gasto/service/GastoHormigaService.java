package com.panini.inventario.gasto.service;

import com.panini.inventario.gasto.model.GastoHormiga;
import com.panini.inventario.gasto.model.dto.GastoHormigaDTO;
import com.panini.inventario.gasto.repository.GastoHormigaRepository;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class GastoHormigaService {

    private final GastoHormigaRepository gastoHormigaRepository;
    private final LoteInversionistaRepository loteInversionistaRepository;
    private final com.panini.inventario.negocio.repository.NegocioRepository negocioRepository;

    @Transactional
    public GastoHormiga registrarGasto(GastoHormigaDTO dto, Integer negocioId) {
        com.panini.inventario.negocio.model.Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));

        GastoHormiga gasto = GastoHormiga.builder()
                .descripcion(dto.descripcion())
                .monto(dto.monto())
                .categoria(dto.categoria())
                .negocio(negocio)
                .build();

        if (dto.loteInversionistaId() != null) {
            gasto.setLoteInversionista(loteInversionistaRepository.findById(dto.loteInversionistaId())
                    .orElseThrow(() -> new IllegalArgumentException("Lote inversionista no encontrado con ID: " + dto.loteInversionistaId())));
        }

        return gastoHormigaRepository.save(gasto);
    }
}
