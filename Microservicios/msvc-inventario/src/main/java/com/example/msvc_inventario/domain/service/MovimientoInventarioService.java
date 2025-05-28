package com.example.msvc_inventario.domain.service;

import com.example.msvc_inventario.domain.model.MovimientoInventario;

import java.util.List;

public interface MovimientoInventarioService {
    MovimientoInventario registrarMovimiento(MovimientoInventario movimiento);
    MovimientoInventario obtenerPorId(Long id);
    List<MovimientoInventario> listarPorInventarioId(Long inventarioId);
    List<MovimientoInventario> listarTodos();
}