package com.example.msvc_inventario.application.client;

import com.example.msvc_inventario.application.dto.ProductoDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "msvc-producto", url = "${app.msvc-producto.url}")
public interface ProductoClient {

    @GetMapping("/api/productos/{id}")
    ProductoDto obtenerProducto(@PathVariable("id") Long id);

}