package com.example.msvc_inventario.infrastructure.persistence.mapper;

import com.example.msvc_inventario.domain.model.MovimientoInventario;
import com.example.msvc_inventario.infrastructure.persistence.entity.MovimientoInventarioEntity;
import org.springframework.stereotype.Component;

@Component
public class MovimientoInventarioEntityMapper {

    public MovimientoInventarioEntity toEntity(MovimientoInventario domain) {
        if (domain == null) {
            return null;
        }

        MovimientoInventarioEntity entity = new MovimientoInventarioEntity();
        entity.setId(domain.getId());
        entity.setInventarioId(domain.getInventarioId());
        entity.setTipoMovimiento(convertToEntityEnum(domain.getTipoMovimiento()));
        entity.setCantidad(domain.getCantidad());
        entity.setMotivo(domain.getMotivo());
        entity.setFechaMovimiento(domain.getFechaMovimiento());
        entity.setUsuarioId(domain.getUsuarioId());

        return entity;
    }

    public MovimientoInventario toDomain(MovimientoInventarioEntity entity) {
        if (entity == null) {
            return null;
        }

        MovimientoInventario domain = new MovimientoInventario();
        domain.setId(entity.getId());
        domain.setInventarioId(entity.getInventarioId());
        domain.setTipoMovimiento(convertToDomainEnum(entity.getTipoMovimiento()));
        domain.setCantidad(entity.getCantidad());
        domain.setMotivo(entity.getMotivo());
        domain.setFechaMovimiento(entity.getFechaMovimiento());
        domain.setUsuarioId(entity.getUsuarioId());

        return domain;
    }

    private MovimientoInventarioEntity.TipoMovimiento convertToEntityEnum(MovimientoInventario.TipoMovimiento domainEnum) {
        return MovimientoInventarioEntity.TipoMovimiento.valueOf(domainEnum.name());
    }

    private MovimientoInventario.TipoMovimiento convertToDomainEnum(MovimientoInventarioEntity.TipoMovimiento entityEnum) {
        return MovimientoInventario.TipoMovimiento.valueOf(entityEnum.name());
    }
}
