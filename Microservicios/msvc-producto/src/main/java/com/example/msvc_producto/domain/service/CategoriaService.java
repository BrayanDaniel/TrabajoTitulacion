package com.example.msvc_producto.domain.service;

import com.example.msvc_producto.domain.model.Categoria;

import java.util.List;

public interface CategoriaService {
    Categoria crearCategoria(Categoria categoria);
    Categoria actualizarCategoria(Long id, Categoria categoria);
    Categoria obtenerCategoriaPorId(Long id);
    List<Categoria> listarCategorias();
    void eliminarCategoria(Long id);
}