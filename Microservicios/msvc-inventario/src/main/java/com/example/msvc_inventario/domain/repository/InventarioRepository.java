package com.example.msvc_inventario.domain.repository;

import com.example.msvc_inventario.domain.model.Inventario;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository {
    Inventario save(Inventario inventario);
    Optional<Inventario> findById(Long id);
    Optional<Inventario> findByProductoId(Long productoId);
    List<Inventario> findAll();
    void deleteById(Long id);
}