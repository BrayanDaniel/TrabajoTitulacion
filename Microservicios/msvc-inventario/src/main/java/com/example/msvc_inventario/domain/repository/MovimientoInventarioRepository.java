package com.example.msvc_inventario.domain.repository;

import com.example.msvc_inventario.domain.model.MovimientoInventario;

import java.util.List;
import java.util.Optional;

public interface MovimientoInventarioRepository {
    MovimientoInventario save(MovimientoInventario movimiento);
    Optional<MovimientoInventario> findById(Long id);
    List<MovimientoInventario> findByInventarioId(Long inventarioId);
    List<MovimientoInventario> findAll();
}