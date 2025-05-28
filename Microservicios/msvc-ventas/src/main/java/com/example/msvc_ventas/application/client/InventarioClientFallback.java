package com.example.msvc_ventas.application.client;

import com.example.msvc_ventas.application.dto.InventarioInfoDto;
import com.example.msvc_ventas.application.dto.SalidaInventarioLoteRequestDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class InventarioClientFallback implements InventarioClient {

    @Override
    public InventarioInfoDto obtenerInventarioPorProductoId(Long productoId) {
        // Usamos el patrón builder para crear el DTO
        return InventarioInfoDto.builder()
                .id(null)
                .cantidad(0)
                .ubicacion("No disponible")
                .build();
    }

    @Override
    public List<InventarioInfoDto> procesarSalidaLote(SalidaInventarioLoteRequestDto requestDto) {
        // No podemos procesar la salida, retornamos una lista vacía
        return new ArrayList<>();
    }
}