package com.example.msvc_producto.application.mapper;

import com.example.msvc_producto.application.dto.CategoriaRequestDto;
import com.example.msvc_producto.application.dto.CategoriaResponseDto;
import com.example.msvc_producto.domain.model.Categoria;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CategoriaMapper {

    public Categoria toEntity(CategoriaRequestDto dto) {
        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        categoria.setDescripcion(dto.getDescripcion());
        categoria.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        return categoria;
    }

    public Categoria toEntity(CategoriaRequestDto dto, Long id) {
        Categoria categoria = toEntity(dto);
        categoria.setId(id);
        return categoria;
    }

    public CategoriaResponseDto toDto(Categoria entity) {
        CategoriaResponseDto dto = new CategoriaResponseDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setActivo(entity.getActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}