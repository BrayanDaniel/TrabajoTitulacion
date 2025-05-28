package com.example.msvc_producto.application.client;

import com.example.msvc_producto.application.dto.InventarioInfoDto;
import org.springframework.stereotype.Component;

@Component
public class InventarioClientFallback implements InventarioClient {

    @Override
    public InventarioInfoDto crearInventarioParaProducto(Long productoId, Integer stock) {
        // Retornar un objeto por defecto con cantidad 0
        return new InventarioInfoDto(null, 0, "No disponible");
    }

    @Override
    public InventarioInfoDto actualizarStock(Long productoId, Integer cantidad) {
        // Retornar un objeto por defecto con cantidad 0
        return new InventarioInfoDto(null, 0, "No disponible");
    }

    @Override
    public InventarioInfoDto obtenerInventarioPorProductoId(Long productoId) {
        // Retornar un objeto por defecto con cantidad 0
        return new InventarioInfoDto(null, 0, "No disponible");
    }
}