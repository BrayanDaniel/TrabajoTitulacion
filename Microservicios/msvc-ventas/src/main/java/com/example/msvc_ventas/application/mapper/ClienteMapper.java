package com.example.msvc_ventas.application.mapper;

import com.example.msvc_ventas.application.dto.ClienteRequestDto;
import com.example.msvc_ventas.application.dto.ClienteResponseDto;
import com.example.msvc_ventas.domain.model.Cliente;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ClienteMapper {

    public Cliente toEntity(ClienteRequestDto dto) {
        return Cliente.builder()
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .email(dto.getEmail())
                .telefono(dto.getTelefono())
                .documento(dto.getDocumento())
                .activo(true)
                .build();
    }

    public ClienteResponseDto toDto(Cliente cliente) {
        return ClienteResponseDto.builder()
                .id(cliente.getId())
                .nombre(cliente.getNombre())
                .apellido(cliente.getApellido())
                .email(cliente.getEmail())
                .telefono(cliente.getTelefono())
                .documento(cliente.getDocumento())
                .activo(cliente.getActivo())
                .fechaCreacion(cliente.getFechaCreacion())
                .fechaActualizacion(cliente.getFechaActualizacion())
                .build();
    }
}