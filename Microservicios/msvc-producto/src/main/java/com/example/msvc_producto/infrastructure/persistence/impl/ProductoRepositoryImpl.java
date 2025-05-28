package com.example.msvc_producto.infrastructure.persistence.impl;

import com.example.msvc_producto.domain.model.Producto;
import com.example.msvc_producto.domain.repository.ProductoRepository;
import com.example.msvc_producto.infrastructure.persistence.entity.ProductoEntity;
import com.example.msvc_producto.infrastructure.persistence.mapper.ProductoEntityMapper;
import com.example.msvc_producto.infrastructure.persistence.repository.ProductoJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProductoRepositoryImpl implements ProductoRepository {

    private final ProductoJpaRepository productoJpaRepository;
    private final ProductoEntityMapper productoEntityMapper;

    public ProductoRepositoryImpl(ProductoJpaRepository productoJpaRepository, ProductoEntityMapper productoEntityMapper) {
        this.productoJpaRepository = productoJpaRepository;
        this.productoEntityMapper = productoEntityMapper;
    }

    @Override
    public Producto save(Producto producto) {
        ProductoEntity entity = productoEntityMapper.toEntity(producto);
        entity = productoJpaRepository.save(entity);
        return productoEntityMapper.toDomain(entity);
    }

    @Override
    public Optional<Producto> findById(Long id) {
        return productoJpaRepository.findById(id)
                .map(productoEntityMapper::toDomain);
    }

    @Override
    public List<Producto> findAll() {
        return productoJpaRepository.findAll().stream()
                .map(productoEntityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Producto> findByEmpresaId(Long empresaId) {
        return productoJpaRepository.findByEmpresaId(empresaId).stream()
                .map(productoEntityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Producto> findByCategoriaId(Long categoriaId) {
        return productoJpaRepository.findByCategoriaId(categoriaId).stream()
                .map(productoEntityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        productoJpaRepository.deleteById(id);
    }
}