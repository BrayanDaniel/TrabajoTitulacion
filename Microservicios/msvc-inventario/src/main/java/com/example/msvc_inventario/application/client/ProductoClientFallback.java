package com.example.msvc_inventario.application.client;

import com.example.msvc_inventario.application.dto.ProductoDto;
import org.springframework.stereotype.Component;

@Component
public class ProductoClientFallback implements ProductoClient {

    @Override
    public ProductoDto obtenerProducto(Long id) {
        ProductoDto dto = new ProductoDto();
        dto.setId(id);
        dto.setNombre("Producto no disponible");
        return dto;
    }

    @Override
    public void actualizarStockProducto(Long id, Integer stock) {
        // Fallback: no hacer nada si el servicio de productos no está disponible
        System.out.println("Fallback: No se pudo sincronizar stock para producto " + id);
    }
}