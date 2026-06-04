package com.panini.inventario.producto.service;

import com.panini.inventario.producto.model.ComboComposicion;
import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.model.dto.ProductoComboDTO;
import com.panini.inventario.producto.repository.ComboComposicionRepository;
import com.panini.inventario.producto.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final ComboComposicionRepository comboComposicionRepository;

    @Transactional
    public Producto crearComboTemplate(ProductoComboDTO dto) {
        if (dto.componentes() == null || dto.componentes().isEmpty()) {
            throw new IllegalArgumentException("El combo debe tener al menos un producto componente");
        }

        Producto combo = Producto.builder()
                .nombre(dto.nombreCombo())
                .tipo(Producto.Tipo.COMBO)
                .build();
        
        combo = productoRepository.save(combo);

        for (ProductoComboDTO.ComponenteDTO comp : dto.componentes()) {
            Producto hijo = productoRepository.findById(comp.productoId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto hijo no encontrado con ID: " + comp.productoId()));
            
            ComboComposicion composicion = ComboComposicion.builder()
                    .combo(combo)
                    .productoComponente(hijo)
                    .cantidadPacas(comp.cantidadPacas() != null ? comp.cantidadPacas() : 0)
                    .cantidadCajas(comp.cantidadCajas() != null ? comp.cantidadCajas() : 0)
                    .cantidadUnidades(comp.cantidadUnidades() != null ? comp.cantidadUnidades() : 0)
                    .build();
            comboComposicionRepository.save(composicion);
        }

        return combo;
    }
}
