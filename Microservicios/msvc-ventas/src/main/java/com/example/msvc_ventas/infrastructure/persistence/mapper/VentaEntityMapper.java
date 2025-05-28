package com.example.msvc_ventas.infrastructure.persistence.mapper;

import com.example.msvc_ventas.domain.model.Venta;
import com.example.msvc_ventas.infrastructure.persistence.entity.VentaEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VentaEntityMapper {

    private final ClienteEntityMapper clienteEntityMapper;

    public VentaEntity toEntity(Venta domain) {
        return VentaEntity.builder()
                .id(domain.getId())
                .numeroFactura(domain.getNumeroFactura())
                .cliente(clienteEntityMapper.toEntity(domain.getCliente()))
                .subtotal(domain.getSubtotal())
                .impuesto(domain.getImpuesto())
                .total(domain.getTotal())
                .estado(mapEstado(domain.getEstado()))
                .fechaVenta(domain.getFechaVenta())
                .fechaCreacion(domain.getFechaCreacion())
                .fechaActualizacion(domain.getFechaActualizacion())
                .build();
    }

    public Venta toDomain(VentaEntity entity) {
        return Venta.builder()
                .id(entity.getId())
                .numeroFactura(entity.getNumeroFactura())
                .cliente(clienteEntityMapper.toDomain(entity.getCliente()))
                .subtotal(entity.getSubtotal())
                .impuesto(entity.getImpuesto())
                .total(entity.getTotal())
                .estado(mapEstadoDomain(entity.getEstado()))
                .fechaVenta(entity.getFechaVenta())
                .fechaCreacion(entity.getFechaCreacion())
                .fechaActualizacion(entity.getFechaActualizacion())
                .build();
    }

    private VentaEntity.EstadoVenta mapEstado(Venta.EstadoVenta estado) {
        return VentaEntity.EstadoVenta.valueOf(estado.name());
    }

    private Venta.EstadoVenta mapEstadoDomain(VentaEntity.EstadoVenta estado) {
        return Venta.EstadoVenta.valueOf(estado.name());
    }
}