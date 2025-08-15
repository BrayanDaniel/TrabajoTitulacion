package com.example.demo.infrastructure.persistence.repository;

import com.example.demo.infrastructure.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long> {
    // =====================================
    // MÉTODOS EXISTENTES (NO TOCAR)
    // =====================================
    Optional<UsuarioEntity> findByUsername(String username);
    Optional<UsuarioEntity> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // =====================================
    // MÉTODOS NUEVOS PARA GESTIÓN ADMIN
    // =====================================
    List<UsuarioEntity> findByUsernameContainingIgnoreCaseOrNombreContainingIgnoreCaseOrApellidoContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String username, String nombre, String apellido, String email);

    List<UsuarioEntity> findByRolesContaining(String rol);

    long countByActivoTrue();
    long countByActivoFalse();
    long countByRolesContaining(String rol);
}