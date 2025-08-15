package com.example.msvc_producto.presentation.controller;

import com.example.msvc_producto.application.dto.CategoriaRequestDto;
import com.example.msvc_producto.application.dto.CategoriaResponseDto;
import com.example.msvc_producto.application.mapper.CategoriaMapper;
import com.example.msvc_producto.domain.model.Categoria;
import com.example.msvc_producto.domain.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorías", description = "API para gestionar categorías de productos")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;
    @Autowired
    private CategoriaMapper categoriaMapper;


    @PostMapping
    @Operation(summary = "Crear una nueva categoría")
    public ResponseEntity<CategoriaResponseDto> crearCategoria(@Valid @RequestBody CategoriaRequestDto requestDto) {
        Categoria categoria = categoriaMapper.toEntity(requestDto);
        Categoria categoriaCreada = categoriaService.crearCategoria(categoria);
        return new ResponseEntity<>(categoriaMapper.toDto(categoriaCreada), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una categoría existente")
    public ResponseEntity<CategoriaResponseDto> actualizarCategoria(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequestDto requestDto) {
        Categoria categoria = categoriaMapper.toEntity(requestDto, id);
        Categoria categoriaActualizada = categoriaService.actualizarCategoria(id, categoria);
        return ResponseEntity.ok(categoriaMapper.toDto(categoriaActualizada));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una categoría por su ID")
    public ResponseEntity<CategoriaResponseDto> obtenerCategoriaPorId(@PathVariable Long id) {
        Categoria categoria = categoriaService.obtenerCategoriaPorId(id);
        return ResponseEntity.ok(categoriaMapper.toDto(categoria));
    }

    @GetMapping
    @Operation(summary = "Listar todas las categorías")
    public ResponseEntity<List<CategoriaResponseDto>> listarCategorias() {
        List<Categoria> categorias = categoriaService.listarCategorias();
        List<CategoriaResponseDto> responseDtos = categorias.stream()
                .map(categoriaMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDtos);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una categoría")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        categoriaService.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }
}