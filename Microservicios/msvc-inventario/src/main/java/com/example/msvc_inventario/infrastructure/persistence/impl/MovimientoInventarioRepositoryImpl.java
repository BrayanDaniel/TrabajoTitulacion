package com.example.msvc_inventario.infrastructure.persistence.impl;

import com.example.msvc_inventario.domain.model.MovimientoInventario;
import com.example.msvc_inventario.domain.repository.MovimientoInventarioRepository;
import com.example.msvc_inventario.infrastructure.persistence.entity.MovimientoInventarioEntity;
import com.example.msvc_inventario.infrastructure.persistence.mapper.MovimientoInventarioEntityMapper;
import com.example.msvc_inventario.infrastructure.persistence.repository.MovimientoInventarioJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class MovimientoInventarioRepositoryImpl implements MovimientoInventarioRepository {

    private final MovimientoInventarioJpaRepository jpaRepository;
    private final MovimientoInventarioEntityMapper mapper;

    public MovimientoInventarioRepositoryImpl(
            MovimientoInventarioJpaRepository jpaRepository,
            MovimientoInventarioEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public MovimientoInventario save(MovimientoInventario movimiento) {
        MovimientoInventarioEntity entity = mapper.toEntity(movimiento);
        entity = jpaRepository.save(entity);
        return mapper.toDomain(entity);
    }

    @Override
    public Optional<MovimientoInventario> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public List<MovimientoInventario> findByInventarioId(Long inventarioId) {
        return jpaRepository.findByInventarioId(inventarioId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovimientoInventario> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}