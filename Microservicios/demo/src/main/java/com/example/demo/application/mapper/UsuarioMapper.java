package com.example.demo.application.mapper;

import com.example.demo.application.dto.RegistroUsuarioDto;
import com.example.demo.application.dto.UsuarioResponseDto;
import com.example.demo.domain.model.Usuario;
import com.example.demo.infrastructure.persistence.entity.UsuarioEntity;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public Usuario toDomain(UsuarioEntity entity) {
        return Usuario.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .password(entity.getPassword())
                .email(entity.getEmail())
                .nombre(entity.getNombre())
                .apellido(entity.getApellido())
                .activo(entity.isActivo())
                .roles(entity.getRoles())
                .build();
    }

    public UsuarioEntity toEntity(Usuario domain) {
        return UsuarioEntity.builder()
                .id(domain.getId())
                .username(domain.getUsername())
                .password(domain.getPassword())
                .email(domain.getEmail())
                .nombre(domain.getNombre())
                .apellido(domain.getApellido())
                .activo(domain.isActivo())
                .roles(domain.getRoles())
                .build();
    }

    public Usuario toDomain(RegistroUsuarioDto dto) {
        return Usuario.builder()
                .username(dto.getUsername())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .build();
    }

    public UsuarioResponseDto toResponseDto(Usuario domain) {
        UsuarioResponseDto dto = new UsuarioResponseDto();
        dto.setId(domain.getId());
        dto.setUsername(domain.getUsername());
        dto.setEmail(domain.getEmail());
        dto.setNombre(domain.getNombre());
        dto.setApellido(domain.getApellido());
        dto.setRoles(domain.getRoles());
        return dto;
    }
}