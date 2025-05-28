package com.example.msvc_inventario.application.client;

import com.example.msvc_inventario.application.dto.ProductoDto;
import org.springframework.stereotype.Component;

@Component
public class ProductoClientFallback implements ProductoClient {

    @Override
    public ProductoDto obtenerProducto(Long id) {
        // Crear un DTO básico con la información mínima
        ProductoDto dto = new ProductoDto();
        dto.setId(id);
        dto.setNombre("Producto no disponible");
        return dto;
    }

    @Override
    public ProductoDto actualizarStockProducto(Long id, Integer nuevoStock) {
        // Simplemente retornar un DTO básico, ya que no pudimos actualizar
        ProductoDto dto = new ProductoDto();
        dto.setId(id);
        return dto;
    }
}