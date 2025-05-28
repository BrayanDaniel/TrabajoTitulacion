package com.example.msvc_ventas.application.client;

import com.example.msvc_ventas.application.dto.ProductoDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ProductoClientFallback implements ProductoClient {

    @Override
    public ProductoDto obtenerProducto(Long id) {
        return ProductoDto.builder()
                .id(id)
                .nombre("Producto no disponible")
                .precio(BigDecimal.ZERO)
                .build();
    }
}