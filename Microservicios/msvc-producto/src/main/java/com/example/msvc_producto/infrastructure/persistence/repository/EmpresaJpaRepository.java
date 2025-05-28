package com.example.msvc_producto.infrastructure.persistence.repository;

import com.example.msvc_producto.infrastructure.persistence.entity.EmpresaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaJpaRepository extends JpaRepository<EmpresaEntity, Long> {
    // Métodos específicos si se necesitan
}