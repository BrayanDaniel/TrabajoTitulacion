package com.example.demo.application.mapper;

import com.example.demo.application.dto.RegistroUsuarioAdminDto;
import com.example.demo.application.dto.RegistroUsuarioDto;
import com.example.demo.application.dto.UsuarioResponseDto;
import com.example.demo.domain.model.Usuario;
import com.example.demo.infrastructure.persistence.entity.UsuarioEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class UsuarioMapper {

    // =====================================
    // MAPEO DESDE REGISTRO PÚBLICO
    // =====================================

    public Usuario toDomain(RegistroUsuarioDto registroDto) {
        return Usuario.builder()
                .username(registroDto.getUsername())
                .email(registroDto.getEmail())
                .nombre(registroDto.getNombre())
                .apellido(registroDto.getApellido())
                .password(registroDto.getPassword())
                .roles(Collections.singleton("ROLE_USER")) // Por defecto cliente
                .activo(true)
                .build();
    }

    // =====================================
    // MAPEO DESDE REGISTRO ADMIN (NUEVO)
    // =====================================

    public Usuario toDomainFromAdmin(RegistroUsuarioAdminDto registroDto) {
        return Usuario.builder()
                .username(registroDto.getUsername())
                .email(registroDto.getEmail())
                .nombre(registroDto.getNombre())
                .apellido(registroDto.getApellido())
                .password(registroDto.getPassword())
                .roles(registroDto.getRoles()) // ✅ Roles específicos del admin
                .activo(true)
                .build();
    }

    // =====================================
    // MAPEO A RESPONSE DTO
    // =====================================

    public UsuarioResponseDto toResponseDto(Usuario usuario) {
        UsuarioResponseDto dto = new UsuarioResponseDto();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setRoles(usuario.getRoles());
        dto.setActivo(usuario.isActivo());
        return dto;
    }

    // =====================================
    // MAPEO ENTITY <-> DOMAIN
    // =====================================

    public UsuarioEntity toEntity(Usuario usuario) {
        return UsuarioEntity.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .activo(usuario.isActivo())
                .roles(usuario.getRoles())
                .build();
    }

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
}