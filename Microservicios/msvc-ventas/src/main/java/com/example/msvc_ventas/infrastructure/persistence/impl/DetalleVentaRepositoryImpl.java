package com.example.msvc_ventas.infrastructure.persistence.impl;

import com.example.msvc_ventas.domain.model.DetalleVenta;
import com.example.msvc_ventas.domain.repository.DetalleVentaRepository;
import com.example.msvc_ventas.infrastructure.persistence.entity.DetalleVentaEntity;
import com.example.msvc_ventas.infrastructure.persistence.mapper.DetalleVentaEntityMapper;
import com.example.msvc_ventas.infrastructure.persistence.repository.DetalleVentaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DetalleVentaRepositoryImpl implements DetalleVentaRepository {

    private final DetalleVentaJpaRepository jpaRepository;
    private final DetalleVentaEntityMapper mapper;

    @Override
    public DetalleVenta save(DetalleVenta detalleVenta) {
        DetalleVentaEntity entity = mapper.toEntity(detalleVenta);
        entity = jpaRepository.save(entity);
        return mapper.toDomain(entity);
    }

    @Override
    public List<DetalleVenta> saveAll(List<DetalleVenta> detalles) {
        List<DetalleVentaEntity> entities = detalles.stream()
                .map(mapper::toEntity)
                .collect(Collectors.toList());

        List<DetalleVentaEntity> savedEntities = jpaRepository.saveAll(entities);

        return savedEntities.stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DetalleVenta> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public List<DetalleVenta> findByVentaId(Long ventaId) {
        return jpaRepository.findByVentaId(ventaId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}