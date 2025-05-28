package com.example.msvc_inventario.presentation.controller;

import com.example.msvc_inventario.application.client.ProductoClient;
import com.example.msvc_inventario.application.dto.InventarioRequestDto;
import com.example.msvc_inventario.application.dto.InventarioResponseDto;
import com.example.msvc_inventario.application.dto.ProductoDto;
import com.example.msvc_inventario.application.dto.SalidaInventarioLoteRequestDto;
import com.example.msvc_inventario.application.mapper.InventarioMapper;
import com.example.msvc_inventario.domain.model.Inventario;
import com.example.msvc_inventario.domain.service.InventarioService;
import feign.FeignException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventarios")
@Tag(name = "Inventarios", description = "API para gestionar inventarios")
public class InventarioController {

    private final InventarioService inventarioService;
    private final InventarioMapper inventarioMapper;
    private final ProductoClient productoClient;

    public InventarioController(
            InventarioService inventarioService,
            InventarioMapper inventarioMapper,
            @Qualifier("com.example.msvc_inventario.application.client.ProductoClient") ProductoClient productoClient) {
        this.inventarioService = inventarioService;
        this.inventarioMapper = inventarioMapper;
        this.productoClient = productoClient;
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo registro de inventario")
    public ResponseEntity<InventarioResponseDto> crearInventario(@Valid @RequestBody InventarioRequestDto requestDto) {
        Inventario inventario = inventarioMapper.toEntity(requestDto);
        Inventario inventarioGuardado = inventarioService.registrarInventario(inventario);

        // Obtener información del producto
        ProductoDto productoDto = null;
        try {
            productoDto = productoClient.obtenerProducto(inventarioGuardado.getProductoId());
        } catch (FeignException e) {
            // Si no se puede obtener el producto, continuamos con la información básica
        }

        InventarioResponseDto responseDto = (productoDto != null)
                ? inventarioMapper.toDto(inventarioGuardado, productoDto)
                : inventarioMapper.toDto(inventarioGuardado);

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @PostMapping("/producto/{productoId}")
    @Operation(summary = "Crear inventario para un producto específico")
    public ResponseEntity<InventarioResponseDto> crearInventarioParaProducto(
            @PathVariable Long productoId,
            @RequestParam Integer stock) {

        InventarioRequestDto requestDto = new InventarioRequestDto();
        requestDto.setProductoId(productoId);
        requestDto.setCantidad(stock);
        requestDto.setUbicacion("Almacén principal"); // Valor por defecto

        return crearInventario(requestDto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un registro de inventario existente")
    public ResponseEntity<InventarioResponseDto> actualizarInventario(
            @PathVariable Long id,
            @Valid @RequestBody InventarioRequestDto requestDto) {

        Inventario inventario = inventarioMapper.toEntity(requestDto);
        Inventario inventarioActualizado = inventarioService.actualizarInventario(id, inventario);

        // Obtener información del producto
        ProductoDto productoDto = null;
        try {
            productoDto = productoClient.obtenerProducto(inventarioActualizado.getProductoId());
        } catch (FeignException e) {
            // Si no se puede obtener el producto, continuamos con la información básica
        }

        InventarioResponseDto responseDto = (productoDto != null)
                ? inventarioMapper.toDto(inventarioActualizado, productoDto)
                : inventarioMapper.toDto(inventarioActualizado);

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un registro de inventario por su ID")
    public ResponseEntity<InventarioResponseDto> obtenerInventarioPorId(@PathVariable Long id) {
        Inventario inventario = inventarioService.obtenerPorId(id);

        // Obtener información del producto
        ProductoDto productoDto = null;
        try {
            productoDto = productoClient.obtenerProducto(inventario.getProductoId());
        } catch (FeignException e) {
            // Si no se puede obtener el producto, continuamos con la información básica
        }

        InventarioResponseDto responseDto = (productoDto != null)
                ? inventarioMapper.toDto(inventario, productoDto)
                : inventarioMapper.toDto(inventario);

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/producto/{productoId}")
    @Operation(summary = "Obtener el inventario por ID de producto")
    public ResponseEntity<InventarioResponseDto> obtenerInventarioPorProductoId(@PathVariable Long productoId) {
        Inventario inventario = inventarioService.obtenerPorProductoId(productoId);

        // Obtener información del producto
        ProductoDto productoDto = null;
        try {
            productoDto = productoClient.obtenerProducto(inventario.getProductoId());
        } catch (FeignException e) {
            // Si no se puede obtener el producto, continuamos con la información básica
        }

        InventarioResponseDto responseDto = (productoDto != null)
                ? inventarioMapper.toDto(inventario, productoDto)
                : inventarioMapper.toDto(inventario);

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    @Operation(summary = "Listar todos los registros de inventario")
    public ResponseEntity<List<InventarioResponseDto>> listarInventarios() {
        List<Inventario> inventarios = inventarioService.listarTodos();

        List<InventarioResponseDto> responseDtos = inventarios.stream()
                .map(inventario -> {
                    // Intentar obtener información del producto para cada inventario
                    ProductoDto productoDto = null;
                    try {
                        productoDto = productoClient.obtenerProducto(inventario.getProductoId());
                    } catch (FeignException e) {
                        // Si no se puede obtener el producto, continuamos con la información básica
                    }

                    return (productoDto != null)
                            ? inventarioMapper.toDto(inventario, productoDto)
                            : inventarioMapper.toDto(inventario);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDtos);
    }

    @PutMapping("/producto/{productoId}/stock")
    @Operation(summary = "Actualizar el stock de un producto")
    public ResponseEntity<InventarioResponseDto> actualizarStock(
            @PathVariable Long productoId,
            @RequestParam Integer cantidad,
            @RequestParam(defaultValue = "AJUSTE") String tipoMovimiento,
            @RequestParam(required = false) String motivo) {

        Inventario inventarioActualizado = inventarioService.actualizarStock(
                productoId, cantidad, tipoMovimiento, motivo);

        // Obtener información del producto
        ProductoDto productoDto = null;
        try {
            productoDto = productoClient.obtenerProducto(inventarioActualizado.getProductoId());
        } catch (FeignException e) {
            // Si no se puede obtener el producto, continuamos con la información básica
        }

        InventarioResponseDto responseDto = (productoDto != null)
                ? inventarioMapper.toDto(inventarioActualizado, productoDto)
                : inventarioMapper.toDto(inventarioActualizado);

        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un registro de inventario")
    public ResponseEntity<Void> eliminarInventario(@PathVariable Long id) {
        inventarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/salida-lote")
    @Operation(summary = "Procesar una salida de inventario en lote")
    public ResponseEntity<List<InventarioResponseDto>> procesarSalidaLote(
            @Valid @RequestBody SalidaInventarioLoteRequestDto requestDto) {

        List<Inventario> inventariosActualizados = inventarioService.procesarSalidaLote(
                requestDto.getItems(),
                requestDto.getMotivo()
        );

        List<InventarioResponseDto> responseDtos = inventariosActualizados.stream()
                .map(inventario -> {
                    // Intentar obtener información del producto
                    ProductoDto productoDto = null;
                    try {
                        productoDto = productoClient.obtenerProducto(inventario.getProductoId());
                    } catch (FeignException e) {
                        // Si no se puede obtener el producto, continuamos con la información básica
                    }

                    return (productoDto != null)
                            ? inventarioMapper.toDto(inventario, productoDto)
                            : inventarioMapper.toDto(inventario);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDtos);
    }
}