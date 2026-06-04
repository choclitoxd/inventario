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

    @Transactional
    public GastoHormiga registrarGasto(GastoHormigaDTO dto) {
        GastoHormiga gasto = GastoHormiga.builder()
                .descripcion(dto.descripcion())
                .monto(dto.monto())
                .categoria(dto.categoria())
                .build();

        if (dto.loteInversionistaId() != null) {
            gasto.setLoteInversionista(loteInversionistaRepository.findById(dto.loteInversionistaId())
                    .orElseThrow(() -> new IllegalArgumentException("Lote inversionista no encontrado con ID: " + dto.loteInversionistaId())));
        }

        return gastoHormigaRepository.save(gasto);
    }
}
