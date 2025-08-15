package com.example.demo.domain.service;

import com.example.demo.application.dto.ActualizarUsuarioDto;
import com.example.demo.application.dto.EstadisticasUsuariosDto;
import com.example.demo.domain.model.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    // =====================================
    // MÉTODOS EXISTENTES (NO TOCAR)
    // =====================================
    Usuario registrarUsuario(Usuario usuario);
    Optional<Usuario> buscarPorUsername(String username);
    boolean existeUsername(String username);
    boolean existeEmail(String email);
    Usuario registrarUsuarioConRoles(Usuario usuario);

    // =====================================
    // MÉTODOS NUEVOS PARA GESTIÓN ADMIN
    // =====================================
    List<Usuario> obtenerTodosLosUsuarios();
    Optional<Usuario> buscarPorId(Long id);
    Usuario actualizarUsuario(Long id, ActualizarUsuarioDto actualizarDto);
    Usuario cambiarEstado(Long id, boolean activo);
    void eliminarUsuario(Long id);
    List<Usuario> buscarUsuarios(String query);
    List<Usuario> buscarPorRol(String rol);
    EstadisticasUsuariosDto obtenerEstadisticas();
}