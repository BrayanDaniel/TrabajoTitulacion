package com.example.msvc_producto.application.mapper;

import com.example.msvc_producto.application.dto.EmpresaRequestDto;
import com.example.msvc_producto.application.dto.EmpresaResponseDto;
import com.example.msvc_producto.domain.model.Empresa;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class EmpresaMapper {

    public Empresa toEntity(EmpresaRequestDto dto) {
        Empresa empresa = new Empresa();
        empresa.setNombre(dto.getNombre());
        empresa.setRuc(dto.getRuc());
        empresa.setDireccion(dto.getDireccion());
        empresa.setTelefono(dto.getTelefono());
        empresa.setEmail(dto.getEmail());
        empresa.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        return empresa;
    }

    public Empresa toEntity(EmpresaRequestDto dto, Long id) {
        Empresa empresa = toEntity(dto);
        empresa.setId(id);
        return empresa;
    }

    public EmpresaResponseDto toDto(Empresa entity) {
        EmpresaResponseDto dto = new EmpresaResponseDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setRuc(entity.getRuc());
        dto.setDireccion(entity.getDireccion());
        dto.setTelefono(entity.getTelefono());
        dto.setEmail(entity.getEmail());
        dto.setActivo(entity.getActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}