package com.example.msvc_ventas.infrastructure.persistence.repository;

import com.example.msvc_ventas.infrastructure.persistence.entity.ClienteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteJpaRepository extends JpaRepository<ClienteEntity, Long> {
    Optional<ClienteEntity> findByEmail(String email);
}