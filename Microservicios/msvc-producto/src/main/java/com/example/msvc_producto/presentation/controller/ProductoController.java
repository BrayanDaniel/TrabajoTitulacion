package com.example.msvc_producto.presentation.controller;

import com.example.msvc_producto.application.client.InventarioClient;
import com.example.msvc_producto.application.dto.InventarioInfoDto;
import com.example.msvc_producto.application.dto.ProductoRequestDto;
import com.example.msvc_producto.application.dto.ProductoResponseDto;
import com.example.msvc_producto.application.mapper.ProductoMapper;
import com.example.msvc_producto.domain.model.Categoria;
import com.example.msvc_producto.domain.model.Empresa;
import com.example.msvc_producto.domain.model.Producto;
import com.example.msvc_producto.domain.service.CategoriaService;
import com.example.msvc_producto.domain.service.EmpresaService;
import com.example.msvc_producto.domain.service.ProductoService;
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
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "API para gestionar productos")
public class ProductoController {

    private final ProductoService productoService;
    private final EmpresaService empresaService;
    private final CategoriaService categoriaService;
    private final ProductoMapper productoMapper;
    private final InventarioClient inventarioClient;

    public ProductoController(
            ProductoService productoService,
            EmpresaService empresaService,
            CategoriaService categoriaService,
            ProductoMapper productoMapper,
            @Qualifier("com.example.msvc_producto.application.client.InventarioClient") InventarioClient inventarioClient) {
        this.productoService = productoService;
        this.empresaService = empresaService;
        this.categoriaService = categoriaService;
        this.productoMapper = productoMapper;
        this.inventarioClient = inventarioClient;
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo producto")
    public ResponseEntity<ProductoResponseDto> crearProducto(@Valid @RequestBody ProductoRequestDto requestDto) {
        // Obtener empresa y categoría
        Empresa empresa = empresaService.obtenerEmpresaPorId(requestDto.getEmpresaId());
        Categoria categoria = categoriaService.obtenerCategoriaPorId(requestDto.getCategoriaId());

        // Crear producto
        Producto producto = productoMapper.toEntity(requestDto, empresa, categoria);
        Producto productoCreado = productoService.crearProducto(producto);

        // Obtener DTO de respuesta
        ProductoResponseDto responseDto = productoMapper.toDto(productoCreado);

        // Intentar obtener información de inventario
        try {
            InventarioInfoDto inventarioInfo = inventarioClient.obtenerInventarioPorProductoId(productoCreado.getId());
            responseDto.setInventario(inventarioInfo);
        } catch (FeignException e) {
            // Si no se puede obtener información de inventario, no hacer nada
        }

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un producto existente")
    public ResponseEntity<ProductoResponseDto> actualizarProducto(
            @PathVariable Long id,
            @Valid @RequestBody ProductoRequestDto requestDto) {
        // Obtener empresa y categoría
        Empresa empresa = empresaService.obtenerEmpresaPorId(requestDto.getEmpresaId());
        Categoria categoria = categoriaService.obtenerCategoriaPorId(requestDto.getCategoriaId());

        // Actualizar producto
        Producto producto = productoMapper.toEntity(requestDto, id, empresa, categoria);
        Producto productoActualizado = productoService.actualizarProducto(id, producto);

        // Obtener DTO de respuesta
        ProductoResponseDto responseDto = productoMapper.toDto(productoActualizado);

        // Intentar obtener información de inventario
        try {
            InventarioInfoDto inventarioInfo = inventarioClient.obtenerInventarioPorProductoId(productoActualizado.getId());
            responseDto.setInventario(inventarioInfo);
        } catch (FeignException e) {
            // Si no se puede obtener información de inventario, no hacer nada
        }

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un producto por su ID")
    public ResponseEntity<ProductoResponseDto> obtenerProductoPorId(@PathVariable Long id) {
        Producto producto = productoService.obtenerProductoPorId(id);
        ProductoResponseDto responseDto = productoMapper.toDto(producto);

        // Intentar obtener información de inventario
        try {
            InventarioInfoDto inventarioInfo = inventarioClient.obtenerInventarioPorProductoId(producto.getId());
            responseDto.setInventario(inventarioInfo);
        } catch (FeignException e) {
            // Si no se puede obtener información de inventario, no hacer nada
        }

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    @Operation(summary = "Listar todos los productos")
    public ResponseEntity<List<ProductoResponseDto>> listarProductos() {
        List<Producto> productos = productoService.listarProductos();
        List<ProductoResponseDto> responseDtos = productos.stream()
                .map(producto -> {
                    ProductoResponseDto dto = productoMapper.toDto(producto);

                    // Intentar obtener información de inventario para cada producto
                    try {
                        InventarioInfoDto inventarioInfo = inventarioClient.obtenerInventarioPorProductoId(producto.getId());
                        dto.setInventario(inventarioInfo);
                    } catch (FeignException e) {
                        // Si no se puede obtener información de inventario, dejamos el inventario como null
                    }

                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/empresa/{empresaId}")
    @Operation(summary = "Buscar productos por empresa")
    public ResponseEntity<List<ProductoResponseDto>> buscarProductosPorEmpresa(@PathVariable Long empresaId) {
        List<Producto> productos = productoService.buscarProductosPorEmpresa(empresaId);
        List<ProductoResponseDto> responseDtos = productos.stream()
                .map(productoMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/categoria/{categoriaId}")
    @Operation(summary = "Buscar productos por categoría")
    public ResponseEntity<List<ProductoResponseDto>> buscarProductosPorCategoria(@PathVariable Long categoriaId) {
        List<Producto> productos = productoService.buscarProductosPorCategoria(categoriaId);
        List<ProductoResponseDto> responseDtos = productos.stream()
                .map(productoMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDtos);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un producto")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

}