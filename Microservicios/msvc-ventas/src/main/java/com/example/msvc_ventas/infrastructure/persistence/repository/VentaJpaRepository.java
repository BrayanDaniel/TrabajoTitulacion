package com.example.msvc_ventas.infrastructure.persistence.repository;

import com.example.msvc_ventas.infrastructure.persistence.entity.VentaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VentaJpaRepository extends JpaRepository<VentaEntity, Long> {
    Optional<VentaEntity> findByNumeroFactura(String numeroFactura);
    List<VentaEntity> findByClienteId(Long clienteId);
}