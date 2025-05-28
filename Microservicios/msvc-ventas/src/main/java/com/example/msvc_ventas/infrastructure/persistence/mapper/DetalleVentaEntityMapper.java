package com.example.msvc_ventas.infrastructure.persistence.mapper;

import com.example.msvc_ventas.domain.model.DetalleVenta;
import com.example.msvc_ventas.infrastructure.persistence.entity.DetalleVentaEntity;
import org.springframework.stereotype.Component;

@Component
public class DetalleVentaEntityMapper {

    public DetalleVentaEntity toEntity(DetalleVenta domain) {
        return DetalleVentaEntity.builder()
                .id(domain.getId())
                .ventaId(domain.getVentaId())
                .productoId(domain.getProductoId())
                .nombreProducto(domain.getNombreProducto())
                .cantidad(domain.getCantidad())
                .precioUnitario(domain.getPrecioUnitario())
                .subtotal(domain.getSubtotal())
                .build();
    }

    public DetalleVenta toDomain(DetalleVentaEntity entity) {
        return DetalleVenta.builder()
                .id(entity.getId())
                .ventaId(entity.getVentaId())
                .productoId(entity.getProductoId())
                .nombreProducto(entity.getNombreProducto())
                .cantidad(entity.getCantidad())
                .precioUnitario(entity.getPrecioUnitario())
                .subtotal(entity.getSubtotal())
                .build();
    }
}