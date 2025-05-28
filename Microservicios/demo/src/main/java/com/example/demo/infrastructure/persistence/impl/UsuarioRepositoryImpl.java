package com.example.demo.infrastructure.persistence.impl;

import com.example.demo.domain.model.Usuario;
import com.example.demo.domain.repository.UsuarioRepository;
import com.example.demo.infrastructure.persistence.entity.UsuarioEntity;
import com.example.demo.infrastructure.persistence.repository.UsuarioJpaRepository;
import com.example.demo.application.mapper.UsuarioMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UsuarioRepositoryImpl implements UsuarioRepository {

    private final UsuarioJpaRepository jpaRepository;
    private final UsuarioMapper mapper;

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioEntity entity = mapper.toEntity(usuario);
        UsuarioEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Usuario> findByUsername(String username) {
        return jpaRepository.findByUsername(username)
                .map(mapper::toDomain);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return jpaRepository.findByEmail(email)
                .map(mapper::toDomain);
    }

    @Override
    public boolean existsByUsername(String username) {
        return jpaRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }
}