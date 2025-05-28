package com.example.msvc_producto.application.client;

import com.example.msvc_producto.application.dto.InventarioInfoDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "msvc-inventario",
        url = "${app.msvc-inventario.url}",
        fallback = InventarioClientFallback.class
)
public interface InventarioClient {

    @PostMapping("/api/inventarios/producto/{productoId}")
    InventarioInfoDto crearInventarioParaProducto(
            @PathVariable("productoId") Long productoId,
            @RequestParam("stock") Integer stock
    );

    @PutMapping("/api/inventarios/producto/{productoId}/stock")
    InventarioInfoDto actualizarStock(
            @PathVariable("productoId") Long productoId,
            @RequestParam("cantidad") Integer cantidad
    );

    @GetMapping("/api/inventarios/producto/{productoId}")
    InventarioInfoDto obtenerInventarioPorProductoId(
            @PathVariable("productoId") Long productoId
    );
}