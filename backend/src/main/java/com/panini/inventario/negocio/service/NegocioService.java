package com.panini.inventario.negocio.service;

import com.panini.inventario.negocio.model.Negocio;
import com.panini.inventario.negocio.dto.NegocioDTO;
import com.panini.inventario.negocio.repository.NegocioRepository;
import com.panini.inventario.usuario.model.Usuario;
import com.panini.inventario.usuario.repository.UsuarioRepository;
import com.panini.inventario.cliente.repository.ClienteRepository;
import com.panini.inventario.venta.repository.VentaRepository;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.gasto.repository.GastoHormigaRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NegocioService {

    private final NegocioRepository negocioRepository;
    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final VentaRepository ventaRepository;
    private final LoteInversionistaRepository loteInversionistaRepository;
    private final GastoHormigaRepository gastoHormigaRepository;

    @Transactional(readOnly = true)
    public List<NegocioDTO> buscarNegocios(String search, Integer duenoId, String dueno) {
        String queryDueno = dueno;
        if (duenoId != null) {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(duenoId);
            if (usuarioOpt.isPresent()) {
                queryDueno = usuarioOpt.get().getUsername();
            } else {
                return List.of();
            }
        }

        List<Negocio> negocios = negocioRepository.buscarConFiltros(search, queryDueno);
        return negocios.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public NegocioDTO crearNegocio(NegocioDTO dto) {
        String duenosStr = dto.duenos();
        if (dto.duenoIds() != null && !dto.duenoIds().isEmpty()) {
            duenosStr = resolveDuenosString(dto.duenoIds());
        }

        Negocio negocio = Negocio.builder()
                .nombre(dto.nombre())
                .duenos(duenosStr)
                .build();

        Negocio saved = negocioRepository.save(negocio);
        return toDTO(saved);
    }

    @Transactional
    public NegocioDTO actualizarNegocio(Integer id, NegocioDTO dto) {
        Negocio negocio = negocioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Negocio no encontrado con ID: " + id));

        negocio.setNombre(dto.nombre());

        String duenosStr = dto.duenos();
        if (dto.duenoIds() != null && !dto.duenoIds().isEmpty()) {
            duenosStr = resolveDuenosString(dto.duenoIds());
        }
        negocio.setDuenos(duenosStr);

        Negocio saved = negocioRepository.save(negocio);
        return toDTO(saved);
    }

    @Transactional
    public void eliminarNegocio(Integer id) {
        Negocio negocio = negocioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Negocio no encontrado con ID: " + id));

        long ventasCount = ventaRepository.countByNegocioId(id);
        long lotesCount = loteInversionistaRepository.countByNegocioId(id);
        long clientesCount = clienteRepository.countByNegocioId(id);
        long gastosCount = gastoHormigaRepository.countByNegocioId(id);

        if (ventasCount > 0 || lotesCount > 0 || clientesCount > 0 || gastosCount > 0) {
            List<String> reasons = new ArrayList<>();
            if (ventasCount > 0) reasons.add(ventasCount + " venta(s)");
            if (lotesCount > 0) reasons.add(lotesCount + " lote(s) de inventario");
            if (clientesCount > 0) reasons.add(clientesCount + " cliente(s)");
            if (gastosCount > 0) reasons.add(gastosCount + " gasto(s) hormiga");

            throw new IllegalStateException("No se puede eliminar la sede '" + negocio.getNombre() + 
                    "' porque tiene registros asociados: " + String.join(", ", reasons) + ".");
        }

        negocioRepository.delete(negocio);
    }

    public NegocioDTO toDTO(Negocio negocio) {
        if (negocio == null) return null;
        List<Integer> duenoIds = new ArrayList<>();
        if (negocio.getDuenos() != null && !negocio.getDuenos().isBlank()) {
            String[] usernames = negocio.getDuenos().split(",");
            for (String uname : usernames) {
                usuarioRepository.findByUsername(uname.trim()).ifPresent(u -> duenoIds.add(u.getId()));
            }
        }
        return new NegocioDTO(negocio.getId(), negocio.getNombre(), negocio.getDuenos(), duenoIds);
    }

    private String resolveDuenosString(List<Integer> duenoIds) {
        if (duenoIds == null || duenoIds.isEmpty()) return null;
        List<String> usernames = new ArrayList<>();
        for (Integer id : duenoIds) {
            usuarioRepository.findById(id).ifPresent(u -> usernames.add(u.getUsername()));
        }
        return usernames.isEmpty() ? null : String.join(",", usernames);
    }
}
