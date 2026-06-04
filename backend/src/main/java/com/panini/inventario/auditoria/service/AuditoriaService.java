package com.panini.inventario.auditoria.service;

import com.panini.inventario.auditoria.model.Auditoria;
import com.panini.inventario.auditoria.repository.AuditoriaRepository;
import com.panini.inventario.negocio.model.Negocio;
import com.panini.inventario.negocio.repository.NegocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final NegocioRepository negocioRepository;

    @Transactional
    public void registrarAccion(String username, String accion, String detalle, Integer negocioId) {
        String usr = (username != null && !username.isBlank()) ? username : "SISTEMA";
        
        Negocio negocio = null;
        if (negocioId != null) {
            negocio = negocioRepository.findById(negocioId).orElse(null);
        }

        Auditoria aud = Auditoria.builder()
                .usuario(usr)
                .accion(accion)
                .detalle(detalle)
                .negocio(negocio)
                .build();

        auditoriaRepository.save(aud);
    }
}
