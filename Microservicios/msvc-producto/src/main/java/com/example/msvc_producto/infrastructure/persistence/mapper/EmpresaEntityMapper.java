package com.example.msvc_producto.infrastructure.persistence.mapper;

import com.example.msvc_producto.domain.model.Empresa;
import com.example.msvc_producto.infrastructure.persistence.entity.EmpresaEntity;
import org.springframework.stereotype.Component;

@Component
public class EmpresaEntityMapper {

    public EmpresaEntity toEntity(Empresa domain) {
        if (domain == null) {
            return null;
        }

        EmpresaEntity entity = new EmpresaEntity();
        entity.setId(domain.getId());
        entity.setNombre(domain.getNombre());
        entity.setRuc(domain.getRuc());
        entity.setDireccion(domain.getDireccion());
        entity.setTelefono(domain.getTelefono());
        entity.setEmail(domain.getEmail());
        entity.setActivo(domain.getActivo());
        entity.setFechaCreacion(domain.getFechaCreacion());
        entity.setFechaActualizacion(domain.getFechaActualizacion());

        return entity;
    }

    public Empresa toDomain(EmpresaEntity entity) {
        if (entity == null) {
            return null;
        }

        Empresa domain = new Empresa();
        domain.setId(entity.getId());
        domain.setNombre(entity.getNombre());
        domain.setRuc(entity.getRuc());
        domain.setDireccion(entity.getDireccion());
        domain.setTelefono(entity.getTelefono());
        domain.setEmail(entity.getEmail());
        domain.setActivo(entity.getActivo());
        domain.setFechaCreacion(entity.getFechaCreacion());
        domain.setFechaActualizacion(entity.getFechaActualizacion());

        return domain;
    }
}