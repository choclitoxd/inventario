package com.panini.inventario.cliente.controller;

import com.panini.inventario.cliente.model.Cliente;
import com.panini.inventario.cliente.repository.ClienteRepository;
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

    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    @GetMapping("/buscar")
    public ResponseEntity<Cliente> buscarPorTelefono(@RequestParam String telefono) {
        return clienteRepository.findByTelefono(telefono)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cliente> registrarCliente(@RequestBody Cliente cliente) {
        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (cliente.getTelefono() == null || cliente.getTelefono().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (clienteRepository.findByTelefono(cliente.getTelefono()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Cliente guardado = clienteRepository.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }
}
