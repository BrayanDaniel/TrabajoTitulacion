package com.example.demo.domain.service;

import com.example.demo.domain.model.Usuario;
import java.util.Optional;

public interface UsuarioService {
    Usuario registrarUsuario(Usuario usuario);
    Optional<Usuario> buscarPorUsername(String username);
    boolean existeUsername(String username);
    boolean existeEmail(String email);
}