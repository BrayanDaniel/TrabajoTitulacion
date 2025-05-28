package com.example.demo.domain.repository;

import com.example.demo.domain.model.Usuario;
import java.util.Optional;

public interface UsuarioRepository {
    Usuario save(Usuario usuario);
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}