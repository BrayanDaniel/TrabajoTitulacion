package com.example.msvc_producto.application.mapper;

import com.example.msvc_producto.application.dto.ProductoRequestDto;
import com.example.msvc_producto.application.dto.ProductoResponseDto;
import com.example.msvc_producto.domain.model.Categoria;
import com.example.msvc_producto.domain.model.Empresa;
import com.example.msvc_producto.domain.model.Producto;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    private final EmpresaMapper empresaMapper;
    private final CategoriaMapper categoriaMapper;

    public ProductoMapper(EmpresaMapper empresaMapper, CategoriaMapper categoriaMapper) {
        this.empresaMapper = empresaMapper;
        this.categoriaMapper = categoriaMapper;
    }

    public Producto toEntity(ProductoRequestDto dto, Empresa empresa, Categoria categoria) {
        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setImagen(dto.getImagen());
        producto.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        producto.setEmpresa(empresa);
        producto.setCategoria(categoria);
        // Ya no establecemos el stock aquí
        return producto;
    }

    public Producto toEntity(ProductoRequestDto dto, Long id, Empresa empresa, Categoria categoria) {
        Producto producto = toEntity(dto, empresa, categoria);
        producto.setId(id);
        return producto;
    }

    public ProductoResponseDto toDto(Producto entity) {
        ProductoResponseDto dto = new ProductoResponseDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setPrecio(entity.getPrecio());
        dto.setImagen(entity.getImagen());
        dto.setActivo(entity.getActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());

        // Mapear empresa y categoría
        if (entity.getEmpresa() != null) {
            dto.setEmpresa(empresaMapper.toDto(entity.getEmpresa()));
        }

        if (entity.getCategoria() != null) {
            dto.setCategoria(categoriaMapper.toDto(entity.getCategoria()));
        }


        return dto;
    }
}