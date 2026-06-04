package com.panini.inventario.cliente.controller;

import com.panini.inventario.cliente.model.Cliente;
import com.panini.inventario.cliente.repository.ClienteRepository;
import com.panini.inventario.negocio.model.Negocio;
import com.panini.inventario.negocio.repository.NegocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class ClienteController {

    private final ClienteRepository clienteRepository;
    private final NegocioRepository negocioRepository;

    @GetMapping
    public List<Cliente> listarClientes(@RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return List.of();
        }
        return clienteRepository.findByNegocioId(negocioId);
    }

    @GetMapping("/buscar")
    public ResponseEntity<Cliente> buscarPorTelefono(
            @RequestParam String telefono,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return ResponseEntity.badRequest().build();
        }
        return clienteRepository.findByTelefonoAndNegocioId(telefono, negocioId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cliente> registrarCliente(
            @RequestBody Cliente cliente,
            @RequestHeader(value = "X-Negocio-Id", required = false) Integer negocioId) {
        if (negocioId == null) {
            return ResponseEntity.badRequest().build();
        }
        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (cliente.getTelefono() == null || cliente.getTelefono().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (clienteRepository.findByTelefonoAndNegocioId(cliente.getTelefono(), negocioId).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));
        cliente.setNegocio(negocio);
        
        Cliente guardado = clienteRepository.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }
}
