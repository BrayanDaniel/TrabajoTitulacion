package com.example.msvc_ventas.presentation.controller;

import com.example.msvc_ventas.application.dto.VentaRequestDto;
import com.example.msvc_ventas.application.dto.VentaResponseDto;
import com.example.msvc_ventas.application.mapper.VentaMapper;
import com.example.msvc_ventas.application.service.VentaApplicationService;
import com.example.msvc_ventas.domain.model.Cliente;
import com.example.msvc_ventas.domain.model.Venta;
import com.example.msvc_ventas.domain.service.ClienteService;
import com.example.msvc_ventas.domain.service.VentaService;
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
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
@Tag(name = "Ventas", description = "API para gestionar ventas")
public class VentaController {

    private final VentaService ventaService;
    private final ClienteService clienteService;
    private final VentaApplicationService ventaApplicationService;
    private final VentaMapper ventaMapper;

    @PostMapping
    @Operation(summary = "Crear una nueva venta")
    public ResponseEntity<VentaResponseDto> crearVenta(@Valid @RequestBody VentaRequestDto requestDto) {
        // Delegamos la lógica de creación al servicio de aplicación que manejará
        // la comunicación con otros microservicios (productos e inventario)
        VentaResponseDto ventaCreada = ventaApplicationService.crearVenta(requestDto);
        return new ResponseEntity<>(ventaCreada, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una venta por su ID")
    public ResponseEntity<VentaResponseDto> obtenerVenta(@PathVariable Long id) {
        Venta venta = ventaService.obtenerVentaPorId(id);
        return ResponseEntity.ok(ventaMapper.toDto(venta));
    }

    @GetMapping("/factura/{numeroFactura}")
    @Operation(summary = "Obtener una venta por su número de factura")
    public ResponseEntity<VentaResponseDto> obtenerVentaPorNumeroFactura(@PathVariable String numeroFactura) {
        Venta venta = ventaService.obtenerVentaPorNumeroFactura(numeroFactura);
        return ResponseEntity.ok(ventaMapper.toDto(venta));
    }

    @GetMapping("/cliente/{clienteId}")
    @Operation(summary = "Listar todas las ventas de un cliente")
    public ResponseEntity<List<VentaResponseDto>> listarVentasPorCliente(@PathVariable Long clienteId) {
        List<Venta> ventas = ventaService.listarVentasPorCliente(clienteId);
        List<VentaResponseDto> ventasDto = ventas.stream()
                .map(ventaMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ventasDto);
    }

    @GetMapping
    @Operation(summary = "Listar todas las ventas")
    public ResponseEntity<List<VentaResponseDto>> listarVentas() {
        List<Venta> ventas = ventaService.listarVentas();
        List<VentaResponseDto> ventasDto = ventas.stream()
                .map(ventaMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ventasDto);
    }

    @PutMapping("/{id}/completar")
    @Operation(summary = "Completar una venta (actualiza el inventario)")
    public ResponseEntity<VentaResponseDto> completarVenta(@PathVariable Long id) {
        Venta venta = ventaService.completarVenta(id);
        return ResponseEntity.ok(ventaMapper.toDto(venta));
    }

    @PutMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar una venta")
    public ResponseEntity<VentaResponseDto> cancelarVenta(@PathVariable Long id) {
        Venta venta = ventaService.cancelarVenta(id);
        return ResponseEntity.ok(ventaMapper.toDto(venta));
    }
}