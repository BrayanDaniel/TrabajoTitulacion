package com.example.msvc_ventas.application.client;

import com.example.msvc_ventas.application.dto.InventarioInfoDto;
import com.example.msvc_ventas.application.dto.SalidaInventarioLoteRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "msvc-inventario", url = "${app.msvc-inventario.url}")
public interface InventarioClient {

    @GetMapping("/api/inventarios/producto/{productoId}")
    InventarioInfoDto obtenerInventarioPorProductoId(@PathVariable("productoId") Long productoId);

    @PostMapping("/api/inventarios/salida-lote")
    List<InventarioInfoDto> procesarSalidaLote(@RequestBody SalidaInventarioLoteRequestDto requestDto);
}