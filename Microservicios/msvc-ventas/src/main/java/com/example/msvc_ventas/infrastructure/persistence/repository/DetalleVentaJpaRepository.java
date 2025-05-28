package com.example.msvc_ventas.infrastructure.persistence.repository;

import com.example.msvc_ventas.infrastructure.persistence.entity.DetalleVentaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetalleVentaJpaRepository extends JpaRepository<DetalleVentaEntity, Long> {
    List<DetalleVentaEntity> findByVentaId(Long ventaId);
}