package com.example.msvc_producto.infrastructure.persistence.repository;

import com.example.msvc_producto.infrastructure.persistence.entity.ProductoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoJpaRepository extends JpaRepository<ProductoEntity, Long> {
    List<ProductoEntity> findByEmpresaId(Long empresaId);
    List<ProductoEntity> findByCategoriaId(Long categoriaId);
}