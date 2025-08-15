package com.example.msvc_inventario.domain.service;

import com.example.msvc_inventario.domain.model.Inventario;
import com.example.msvc_inventario.application.dto.SalidaInventarioItemDto;

import java.util.List;

public interface InventarioService {
    Inventario registrarInventario(Inventario inventario);
    Inventario actualizarInventario(Long id, Inventario inventario);
    Inventario obtenerPorId(Long id);
    Inventario obtenerPorProductoId(Long productoId);
    List<Inventario> listarTodos();
    void eliminar(Long id);
    Inventario actualizarStock(Long productoId, Integer cantidad, String tipoMovimiento, String motivo);
    List<Inventario> procesarSalidaLote(List<SalidaInventarioItemDto> items, String motivo);

    // Método adicional para obtener solo la cantidad
    Integer obtenerCantidadPorProducto(Long productoId);
}