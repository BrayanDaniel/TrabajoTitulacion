package com.example.msvc_inventario.presentation.controller;

import com.example.msvc_inventario.application.dto.MovimientoInventarioRequestDto;
import com.example.msvc_inventario.application.dto.MovimientoInventarioResponseDto;
import com.example.msvc_inventario.application.mapper.MovimientoInventarioMapper;
import com.example.msvc_inventario.domain.model.MovimientoInventario;
import com.example.msvc_inventario.domain.service.MovimientoInventarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movimientos")
@Tag(name = "Movimientos de Inventario", description = "API para gestionar los movimientos de inventario")
public class MovimientoInventarioController {

    private final MovimientoInventarioService movimientoService;
    private final MovimientoInventarioMapper movimientoMapper;

    public MovimientoInventarioController(
            MovimientoInventarioService movimientoService,
            MovimientoInventarioMapper movimientoMapper) {
        this.movimientoService = movimientoService;
        this.movimientoMapper = movimientoMapper;
    }

    @PostMapping
    @Operation(summary = "Registrar un nuevo movimiento de inventario")
    public ResponseEntity<MovimientoInventarioResponseDto> registrarMovimiento(
            @Valid @RequestBody MovimientoInventarioRequestDto requestDto) {

        MovimientoInventario movimiento = movimientoMapper.toEntity(requestDto);
        MovimientoInventario movimientoRegistrado = movimientoService.registrarMovimiento(movimiento);

        return new ResponseEntity<>(
                movimientoMapper.toDto(movimientoRegistrado),
                HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un movimiento de inventario por su ID")
    public ResponseEntity<MovimientoInventarioResponseDto> obtenerMovimientoPorId(@PathVariable Long id) {
        MovimientoInventario movimiento = movimientoService.obtenerPorId(id);
        return ResponseEntity.ok(movimientoMapper.toDto(movimiento));
    }

    @GetMapping("/inventario/{inventarioId}")
    @Operation(summary = "Listar movimientos por ID de inventario")
    public ResponseEntity<List<MovimientoInventarioResponseDto>> listarMovimientosPorInventarioId(
            @PathVariable Long inventarioId) {

        List<MovimientoInventario> movimientos = movimientoService.listarPorInventarioId(inventarioId);

        List<MovimientoInventarioResponseDto> responseDtos = movimientos.stream()
                .map(movimientoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping
    @Operation(summary = "Listar todos los movimientos de inventario")
    public ResponseEntity<List<MovimientoInventarioResponseDto>> listarMovimientos() {
        List<MovimientoInventario> movimientos = movimientoService.listarTodos();

        List<MovimientoInventarioResponseDto> responseDtos = movimientos.stream()
                .map(movimientoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDtos);
    }
}