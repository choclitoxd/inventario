package com.panini.inventario.stock.service;

import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.model.RegistroCajaAbierta;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.stock.repository.RegistroCajaAbiertaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class InventarioService {

    private final InventarioRepository inventarioRepository;
    private final RegistroCajaAbiertaRepository registroCajaAbiertaRepository;

    @Transactional
    public Inventario abrirCaja(Integer inventarioId) {
        Inventario inventario = inventarioRepository.findById(inventarioId)
                .orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado con ID: " + inventarioId));

        if (inventario.getProducto().getTipo() != Producto.Tipo.LAMINAS) {
            throw new IllegalStateException("Solo se pueden abrir cajas de productos tipo LAMINAS");
        }

        if (inventario.getCantActualCajas() < 1) {
            throw new IllegalStateException("No hay suficientes cajas en este lote para abrir. Cantidad actual: " + inventario.getCantActualCajas());
        }

        // Aplicar la invariante de negocio: -1 caja, +104 sobres
        inventario.setCantActualCajas(inventario.getCantActualCajas() - 1);
        inventario.setCantActualUnidades(inventario.getCantActualUnidades() + 104);

        inventarioRepository.save(inventario);

        // Registrar el evento de auditoría
        RegistroCajaAbierta registro = RegistroCajaAbierta.builder()
                .inventario(inventario)
                .cantidadCajas(1)
                .sobresAdicionados(104)
                .build();

        registroCajaAbiertaRepository.save(registro);

        return inventario;
    }

    @Transactional
    public void abrirPacaLaminas(Integer inventarioId) {
        Inventario inventario = inventarioRepository.findById(inventarioId)
                .orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado con ID: " + inventarioId));

        if (inventario.getProducto().getTipo() != Producto.Tipo.LAMINAS) {
            throw new IllegalStateException("Solo se pueden abrir pacas de productos tipo LAMINAS");
        }

        if (inventario.getCantActualPacas() < 1) {
            throw new IllegalStateException("No hay suficientes pacas. Cantidad actual: " + inventario.getCantActualPacas());
        }

        // 1 Paca de Láminas = 10 Cajas
        inventario.setCantActualPacas(inventario.getCantActualPacas() - 1);
        inventario.setCantActualCajas(inventario.getCantActualCajas() + 10);
        inventarioRepository.save(inventario);
    }

    @Transactional
    public void abrirPacaAlbumes(Integer inventarioId) {
        Inventario inventario = inventarioRepository.findById(inventarioId)
                .orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado con ID: " + inventarioId));

        if (inventario.getProducto().getTipo() != Producto.Tipo.ALBUM) {
            throw new IllegalStateException("Solo se pueden abrir pacas de productos tipo ALBUM");
        }

        if (inventario.getCantActualPacas() < 1) {
            throw new IllegalStateException("No hay suficientes pacas. Cantidad actual: " + inventario.getCantActualPacas());
        }

        // 1 Paca de Álbumes = 26 Álbumes (unidades)
        inventario.setCantActualPacas(inventario.getCantActualPacas() - 1);
        inventario.setCantActualUnidades(inventario.getCantActualUnidades() + 26);
        inventarioRepository.save(inventario);
    }
}
