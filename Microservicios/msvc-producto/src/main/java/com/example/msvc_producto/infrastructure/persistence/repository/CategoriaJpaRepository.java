package com.example.msvc_producto.infrastructure.persistence.repository;

import com.example.msvc_producto.infrastructure.persistence.entity.CategoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaJpaRepository extends JpaRepository<CategoriaEntity, Long> {
    // Métodos específicos si se necesitan
}