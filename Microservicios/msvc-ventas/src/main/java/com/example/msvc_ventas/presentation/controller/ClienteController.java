package com.example.msvc_ventas.presentation.controller;

import com.example.msvc_ventas.application.dto.ClienteRequestDto;
import com.example.msvc_ventas.application.dto.ClienteResponseDto;
import com.example.msvc_ventas.application.mapper.ClienteMapper;
import com.example.msvc_ventas.domain.model.Cliente;
import com.example.msvc_ventas.domain.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@Tag(name = "Clientes", description = "API para gestionar clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final ClienteMapper clienteMapper;

    @PostMapping
    @Operation(summary = "Crear un nuevo cliente")
    public ResponseEntity<ClienteResponseDto> crearCliente(@Valid @RequestBody ClienteRequestDto requestDto) {
        Cliente cliente = clienteMapper.toEntity(requestDto);
        Cliente clienteCreado = clienteService.crearCliente(cliente);
        return new ResponseEntity<>(clienteMapper.toDto(clienteCreado), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un cliente existente")
    public ResponseEntity<ClienteResponseDto> actualizarCliente(
            @PathVariable Long id,
            @Valid @RequestBody ClienteRequestDto requestDto) {
        Cliente cliente = clienteMapper.toEntity(requestDto);
        Cliente clienteActualizado = clienteService.actualizarCliente(id, cliente);
        return ResponseEntity.ok(clienteMapper.toDto(clienteActualizado));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un cliente por su ID")
    public ResponseEntity<ClienteResponseDto> obtenerCliente(@PathVariable Long id) {
        Cliente cliente = clienteService.obtenerClientePorId(id);
        return ResponseEntity.ok(clienteMapper.toDto(cliente));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Obtener un cliente por su email")
    public ResponseEntity<ClienteResponseDto> obtenerClientePorEmail(@PathVariable String email) {
        Cliente cliente = clienteService.obtenerClientePorEmail(email);
        return ResponseEntity.ok(clienteMapper.toDto(cliente));
    }

    @GetMapping
    @Operation(summary = "Listar todos los clientes")
    public ResponseEntity<List<ClienteResponseDto>> listarClientes() {
        List<Cliente> clientes = clienteService.listarClientes();
        List<ClienteResponseDto> clientesDto = clientes.stream()
                .map(clienteMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clientesDto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un cliente (desactivación lógica)")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {
        clienteService.eliminarCliente(id);
        return ResponseEntity.noContent().build();
    }
}