package com.example.msvc_inventario.infrastructure.persistence.repository;

import com.example.msvc_inventario.infrastructure.persistence.entity.InventarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventarioJpaRepository extends JpaRepository<InventarioEntity, Long> {
    Optional<InventarioEntity> findByProductoId(Long productoId);
}