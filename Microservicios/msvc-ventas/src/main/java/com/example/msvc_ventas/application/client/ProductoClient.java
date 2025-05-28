package com.example.msvc_ventas.application.client;

import com.example.msvc_ventas.application.dto.ProductoDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "msvc-producto", url = "${app.msvc-producto.url}")
public interface ProductoClient {

    @GetMapping("/api/productos/{id}")
    ProductoDto obtenerProducto(@PathVariable("id") Long id);
}