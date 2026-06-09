package com.panini.inventario.lote.service;

import com.panini.inventario.lote.model.Inversionista;
import com.panini.inventario.lote.repository.InversionistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProveedorService {

    private final InversionistaRepository inversionistaRepository;

    public List<Inversionista> listarProveedores() {
        return inversionistaRepository.findAll(); // Global catalog, no filtering by negocioId
    }
}
