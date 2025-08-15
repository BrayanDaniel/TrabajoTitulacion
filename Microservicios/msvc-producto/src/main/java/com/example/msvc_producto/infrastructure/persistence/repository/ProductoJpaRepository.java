package com.example.msvc_producto.infrastructure.persistence.repository;

import com.example.msvc_producto.infrastructure.persistence.entity.ProductoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductoJpaRepository extends JpaRepository<ProductoEntity, Long> {
    List<ProductoEntity> findByEmpresaId(Long empresaId);
    List<ProductoEntity> findByCategoriaId(Long categoriaId);
    @Query(value = """
    SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen,
        c.nombre as categoriaNombre,
        e.nombre as empresaNombre
    FROM productos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    INNER JOIN empresas e ON e.id = p.empresa_id
    WHERE p.activo = true
    ORDER BY p.id ASC
    """, nativeQuery = true)
    List<Object[]> findAllProductosOptimized();
}