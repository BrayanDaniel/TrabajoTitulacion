package com.example.msvc_inventario.application.mapper;

import com.example.msvc_inventario.application.dto.MovimientoInventarioRequestDto;
import com.example.msvc_inventario.application.dto.MovimientoInventarioResponseDto;
import com.example.msvc_inventario.domain.model.MovimientoInventario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MovimientoInventarioMapper {

    public MovimientoInventario toEntity(MovimientoInventarioRequestDto dto) {
        MovimientoInventario entity = new MovimientoInventario();
        entity.setInventarioId(dto.getInventarioId());
        entity.setTipoMovimiento(MovimientoInventario.TipoMovimiento.valueOf(dto.getTipoMovimiento()));
        entity.setCantidad(dto.getCantidad());
        entity.setMotivo(dto.getMotivo());
        entity.setFechaMovimiento(LocalDateTime.now());
        entity.setUsuarioId(1L); // Por defecto, podría obtenerse del contexto de seguridad en un futuro
        return entity;
    }

    public MovimientoInventarioResponseDto toDto(MovimientoInventario entity) {
        MovimientoInventarioResponseDto dto = new MovimientoInventarioResponseDto();
        dto.setId(entity.getId());
        dto.setInventarioId(entity.getInventarioId());
        dto.setTipoMovimiento(entity.getTipoMovimiento().name());
        dto.setCantidad(entity.getCantidad());
        dto.setMotivo(entity.getMotivo());
        dto.setFechaMovimiento(entity.getFechaMovimiento());
        dto.setUsuarioId(entity.getUsuarioId());
        return dto;
    }
}