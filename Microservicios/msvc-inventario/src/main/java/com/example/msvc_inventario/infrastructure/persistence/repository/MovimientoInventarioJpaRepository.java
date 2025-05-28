package com.example.msvc_inventario.infrastructure.persistence.repository;

import com.example.msvc_inventario.infrastructure.persistence.entity.MovimientoInventarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovimientoInventarioJpaRepository extends JpaRepository<MovimientoInventarioEntity, Long> {
    List<MovimientoInventarioEntity> findByInventarioId(Long inventarioId);
}