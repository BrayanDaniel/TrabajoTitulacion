package com.example.msvc_inventario.infrastructure.persistence.mapper;

import com.example.msvc_inventario.domain.model.Inventario;
import com.example.msvc_inventario.infrastructure.persistence.entity.InventarioEntity;
import org.springframework.stereotype.Component;

@Component
public class InventarioEntityMapper {

    public InventarioEntity toEntity(Inventario domain) {
        if (domain == null) {
            return null;
        }

        InventarioEntity entity = new InventarioEntity();
        entity.setId(domain.getId());
        entity.setProductoId(domain.getProductoId());
        entity.setCantidad(domain.getCantidad());
        entity.setUbicacion(domain.getUbicacion());
        entity.setActivo(domain.getActivo());
        entity.setFechaCreacion(domain.getFechaCreacion());
        entity.setFechaActualizacion(domain.getFechaActualizacion());

        return entity;
    }

    public Inventario toDomain(InventarioEntity entity) {
        if (entity == null) {
            return null;
        }

        Inventario domain = new Inventario();
        domain.setId(entity.getId());
        domain.setProductoId(entity.getProductoId());
        domain.setCantidad(entity.getCantidad());
        domain.setUbicacion(entity.getUbicacion());
        domain.setActivo(entity.getActivo());
        domain.setFechaCreacion(entity.getFechaCreacion());
        domain.setFechaActualizacion(entity.getFechaActualizacion());

        return domain;
    }
}