package com.example.demo.application.service;

import com.example.demo.domain.model.Usuario;
import com.example.demo.domain.repository.UsuarioRepository;
import com.example.demo.domain.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Usuario registrarUsuario(Usuario usuario) {
        // Encriptar password
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        // Asignar rol por defecto
        usuario.setRoles(Collections.singleton("ROLE_USER"));
        usuario.setActivo(true);
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    @Override
    public boolean existeUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    @Override
    public boolean existeEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
}