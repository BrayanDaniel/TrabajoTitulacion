package com.example.msvc_producto.application.client;

import com.example.msvc_producto.application.dto.InventarioInfoDto;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class InventarioClientFallback implements InventarioClient {

    @Override
    public InventarioInfoDto crearInventarioParaProducto(Long productoId, Integer stock) {
        return new InventarioInfoDto(null, 0, "No disponible");
    }

    @Override
    public InventarioInfoDto actualizarStock(Long productoId, Integer cantidad) {
        return new InventarioInfoDto(null, 0, "No disponible");
    }

    @Override
    public InventarioInfoDto obtenerInventarioPorProductoId(Long productoId) {
        return new InventarioInfoDto(null, 0, "No disponible");
    }

    // ✅ NUEVO: Fallback para método batch
    @Override
    public Map<Long, InventarioInfoDto> obtenerInventariosPorProductos(List<Long> productosIds) {
        Map<Long, InventarioInfoDto> fallbackInventarios = new HashMap<>();

        // Crear inventarios con cantidad 0 para todos los productos
        for (Long productoId : productosIds) {
            fallbackInventarios.put(productoId, new InventarioInfoDto(null, 0, "No disponible"));
        }

        return fallbackInventarios;
    }
}