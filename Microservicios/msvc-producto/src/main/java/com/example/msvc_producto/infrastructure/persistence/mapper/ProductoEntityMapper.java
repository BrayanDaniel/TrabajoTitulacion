package com.example.msvc_producto.infrastructure.persistence.mapper;

import com.example.msvc_producto.domain.model.Producto;
import com.example.msvc_producto.infrastructure.persistence.entity.ProductoEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductoEntityMapper {

    private final EmpresaEntityMapper empresaEntityMapper;
    private final CategoriaEntityMapper categoriaEntityMapper;

    public ProductoEntityMapper(EmpresaEntityMapper empresaEntityMapper, CategoriaEntityMapper categoriaEntityMapper) {
        this.empresaEntityMapper = empresaEntityMapper;
        this.categoriaEntityMapper = categoriaEntityMapper;
    }

    public ProductoEntity toEntity(Producto domain) {
        if (domain == null) {
            return null;
        }

        ProductoEntity entity = new ProductoEntity();
        entity.setId(domain.getId());
        entity.setNombre(domain.getNombre());
        entity.setDescripcion(domain.getDescripcion());
        entity.setPrecio(domain.getPrecio());

        entity.setImagen(domain.getImagen());
        entity.setActivo(domain.getActivo());
        entity.setFechaCreacion(domain.getFechaCreacion());
        entity.setFechaActualizacion(domain.getFechaActualizacion());

        if (domain.getEmpresa() != null) {
            entity.setEmpresa(empresaEntityMapper.toEntity(domain.getEmpresa()));
        }

        if (domain.getCategoria() != null) {
            entity.setCategoria(categoriaEntityMapper.toEntity(domain.getCategoria()));
        }

        return entity;
    }

    public Producto toDomain(ProductoEntity entity) {
        if (entity == null) {
            return null;
        }

        Producto domain = new Producto();
        domain.setId(entity.getId());
        domain.setNombre(entity.getNombre());
        domain.setDescripcion(entity.getDescripcion());
        domain.setPrecio(entity.getPrecio());
        domain.setImagen(entity.getImagen());
        domain.setActivo(entity.getActivo());
        domain.setFechaCreacion(entity.getFechaCreacion());
        domain.setFechaActualizacion(entity.getFechaActualizacion());

        if (entity.getEmpresa() != null) {
            domain.setEmpresa(empresaEntityMapper.toDomain(entity.getEmpresa()));
        }

        if (entity.getCategoria() != null) {
            domain.setCategoria(categoriaEntityMapper.toDomain(entity.getCategoria()));
        }

        return domain;
    }
}