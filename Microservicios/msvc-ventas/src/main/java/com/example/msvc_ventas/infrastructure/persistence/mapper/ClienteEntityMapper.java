package com.example.msvc_ventas.infrastructure.persistence.mapper;

import com.example.msvc_ventas.domain.model.Cliente;
import com.example.msvc_ventas.infrastructure.persistence.entity.ClienteEntity;
import org.springframework.stereotype.Component;

@Component
public class ClienteEntityMapper {

    public ClienteEntity toEntity(Cliente domain) {
        return ClienteEntity.builder()
                .id(domain.getId())
                .nombre(domain.getNombre())
                .apellido(domain.getApellido())
                .email(domain.getEmail())
                .telefono(domain.getTelefono())
                .documento(domain.getDocumento())
                .activo(domain.getActivo())
                .fechaCreacion(domain.getFechaCreacion())
                .fechaActualizacion(domain.getFechaActualizacion())
                .build();
    }

    public Cliente toDomain(ClienteEntity entity) {
        return Cliente.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .apellido(entity.getApellido())
                .email(entity.getEmail())
                .telefono(entity.getTelefono())
                .documento(entity.getDocumento())
                .activo(entity.getActivo())
                .fechaCreacion(entity.getFechaCreacion())
                .fechaActualizacion(entity.getFechaActualizacion())
                .build();
    }
}