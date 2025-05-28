package com.example.msvc_producto.infrastructure.persistence.mapper;

import com.example.msvc_producto.domain.model.Categoria;
import com.example.msvc_producto.infrastructure.persistence.entity.CategoriaEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoriaEntityMapper {

    public CategoriaEntity toEntity(Categoria domain) {
        if (domain == null) {
            return null;
        }

        CategoriaEntity entity = new CategoriaEntity();
        entity.setId(domain.getId());
        entity.setNombre(domain.getNombre());
        entity.setDescripcion(domain.getDescripcion());
        entity.setActivo(domain.getActivo());
        entity.setFechaCreacion(domain.getFechaCreacion());
        entity.setFechaActualizacion(domain.getFechaActualizacion());

        return entity;
    }

    public Categoria toDomain(CategoriaEntity entity) {
        if (entity == null) {
            return null;
        }

        Categoria domain = new Categoria();
        domain.setId(entity.getId());
        domain.setNombre(entity.getNombre());
        domain.setDescripcion(entity.getDescripcion());
        domain.setActivo(entity.getActivo());
        domain.setFechaCreacion(entity.getFechaCreacion());
        domain.setFechaActualizacion(entity.getFechaActualizacion());

        return domain;
    }
}