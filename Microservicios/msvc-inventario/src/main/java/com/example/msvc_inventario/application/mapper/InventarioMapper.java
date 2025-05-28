package com.example.msvc_inventario.application.mapper;

import com.example.msvc_inventario.application.dto.InventarioRequestDto;
import com.example.msvc_inventario.application.dto.InventarioResponseDto;
import com.example.msvc_inventario.application.dto.ProductoDto;
import com.example.msvc_inventario.domain.model.Inventario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class InventarioMapper {

    public Inventario toEntity(InventarioRequestDto dto) {
        Inventario inventario = new Inventario();
        inventario.setProductoId(dto.getProductoId());
        inventario.setCantidad(dto.getCantidad());
        inventario.setUbicacion(dto.getUbicacion());
        inventario.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        return inventario;
    }

    public InventarioResponseDto toDto(Inventario entity, ProductoDto producto) {
        InventarioResponseDto dto = new InventarioResponseDto();
        dto.setId(entity.getId());
        dto.setProducto(producto);
        dto.setCantidad(entity.getCantidad());
        dto.setUbicacion(entity.getUbicacion());
        dto.setActivo(entity.getActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }

    // Método simple para cuando no tenemos información del producto
    public InventarioResponseDto toDto(Inventario entity) {
        InventarioResponseDto dto = new InventarioResponseDto();
        dto.setId(entity.getId());
        dto.setCantidad(entity.getCantidad());
        dto.setUbicacion(entity.getUbicacion());
        dto.setActivo(entity.getActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());

        // Crear un ProductoDto básico sólo con el ID
        ProductoDto productoDto = new ProductoDto();
        productoDto.setId(entity.getProductoId());
        dto.setProducto(productoDto);

        return dto;
    }
}