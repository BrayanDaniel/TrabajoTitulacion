package com.example.demo.presentation.controller;

import com.example.demo.application.dto.*;
import com.example.demo.application.mapper.UsuarioMapper;
import com.example.demo.application.service.AuthService;
import com.example.demo.domain.model.Usuario;
import com.example.demo.domain.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@Tag(name = "Gestión de Usuarios", description = "API para gestión de usuarios por administradores")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthService authService;
    private final UsuarioMapper usuarioMapper;

    // =====================================
    // ENDPOINTS DE AUTENTICACIÓN PÚBLICA
    // =====================================

    @PostMapping("/auth/registro")
    @Operation(summary = "Registro público de clientes")
    public ResponseEntity<UsuarioResponseDto> registrarCliente(@Valid @RequestBody RegistroUsuarioDto registroDto) {
        if (usuarioService.existeUsername(registroDto.getUsername())) {
            return ResponseEntity.badRequest().build();
        }

        if (usuarioService.existeEmail(registroDto.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        Usuario usuario = usuarioMapper.toDomain(registroDto);
        Usuario usuarioRegistrado = usuarioService.registrarUsuario(usuario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioMapper.toResponseDto(usuarioRegistrado));
    }

    @PostMapping("/auth/login")
    @Operation(summary = "Iniciar sesión")
    public ResponseEntity<TokenResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        try {
            TokenResponseDto tokenResponse = authService.login(loginRequest);

            Optional<Usuario> usuarioOpt = usuarioService.buscarPorUsername(loginRequest.getUsername());
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                UsuarioResponseDto usuarioDto = usuarioMapper.toResponseDto(usuario);
                tokenResponse.setUsuario(usuarioDto);
            }

            return ResponseEntity.ok(tokenResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // =====================================
    // GESTIÓN DE USUARIOS (Solo Admin)
    // =====================================

    @PostMapping("/usuarios")
    @Operation(summary = "Crear usuario con rol específico (Solo Admin)",
            description = "Permite al administrador crear cualquier tipo de usuario eligiendo el rol")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponseDto> crearUsuario(
            @Valid @RequestBody RegistroUsuarioAdminDto registroDto) {

        // Validar unicidad
        if (usuarioService.existeUsername(registroDto.getUsername())) {
            return ResponseEntity.badRequest().build();
        }

        if (usuarioService.existeEmail(registroDto.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        // Crear usuario con roles específicos
        Usuario usuario = usuarioMapper.toDomainFromAdmin(registroDto);
        Usuario usuarioRegistrado = usuarioService.registrarUsuarioConRoles(usuario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioMapper.toResponseDto(usuarioRegistrado));
    }

    @GetMapping("/usuarios")
    @Operation(summary = "Listar todos los usuarios (Solo Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDto>> obtenerUsuarios() {
        try {
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            List<UsuarioResponseDto> usuariosDto = usuarios.stream()
                    .map(usuarioMapper::toResponseDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(usuariosDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/usuarios/{id}")
    @Operation(summary = "Obtener usuario por ID (Solo Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponseDto> obtenerUsuarioPorId(@PathVariable Long id) {
        try {
            Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(id);

            if (usuarioOpt.isPresent()) {
                UsuarioResponseDto usuarioDto = usuarioMapper.toResponseDto(usuarioOpt.get());
                return ResponseEntity.ok(usuarioDto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/usuarios/{id}")
    @Operation(summary = "Actualizar usuario (Solo Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponseDto> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarUsuarioDto actualizarDto) {
        try {
            Optional<Usuario> usuarioExistenteOpt = usuarioService.buscarPorId(id);
            if (!usuarioExistenteOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Usuario usuarioExistente = usuarioExistenteOpt.get();

            // Validaciones de unicidad
            if (actualizarDto.getUsername() != null &&
                    !actualizarDto.getUsername().equals(usuarioExistente.getUsername()) &&
                    usuarioService.existeUsername(actualizarDto.getUsername())) {
                return ResponseEntity.badRequest().build();
            }

            if (actualizarDto.getEmail() != null &&
                    !actualizarDto.getEmail().equals(usuarioExistente.getEmail()) &&
                    usuarioService.existeEmail(actualizarDto.getEmail())) {
                return ResponseEntity.badRequest().build();
            }

            Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, actualizarDto);
            UsuarioResponseDto usuarioDto = usuarioMapper.toResponseDto(usuarioActualizado);

            return ResponseEntity.ok(usuarioDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/usuarios/{id}/estado")
    @Operation(summary = "Cambiar estado del usuario (Solo Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponseDto> cambiarEstadoUsuario(
            @PathVariable Long id,
            @RequestBody CambiarEstadoDto estadoDto) {
        try {
            Usuario usuarioActualizado = usuarioService.cambiarEstado(id, estadoDto.isActivo());
            UsuarioResponseDto usuarioDto = usuarioMapper.toResponseDto(usuarioActualizado);

            return ResponseEntity.ok(usuarioDto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/usuarios/{id}")
    @Operation(summary = "Eliminar usuario (Solo Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/usuarios/buscar")
    @Operation(summary = "Buscar usuarios (Solo Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDto>> buscarUsuarios(@RequestParam String q) {
        try {
            List<Usuario> usuarios = usuarioService.buscarUsuarios(q);
            List<UsuarioResponseDto> usuariosDto = usuarios.stream()
                    .map(usuarioMapper::toResponseDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(usuariosDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/usuarios/rol/{rol}")
    @Operation(summary = "Obtener usuarios por rol (Solo Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDto>> obtenerUsuariosPorRol(@PathVariable String rol) {
        try {
            List<Usuario> usuarios = usuarioService.buscarPorRol(rol);
            List<UsuarioResponseDto> usuariosDto = usuarios.stream()
                    .map(usuarioMapper::toResponseDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(usuariosDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/usuarios/estadisticas")
    @Operation(summary = "Estadísticas de usuarios (Solo Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EstadisticasUsuariosDto> obtenerEstadisticas() {
        try {
            EstadisticasUsuariosDto estadisticas = usuarioService.obtenerEstadisticas();
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // =====================================
    // VALIDACIONES
    // =====================================

    @GetMapping("/usuarios/validar/username/{username}")
    @Operation(summary = "Validar username disponible")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> validarUsername(@PathVariable String username) {
        boolean disponible = !usuarioService.existeUsername(username);
        return ResponseEntity.ok(disponible);
    }

    @GetMapping("/usuarios/validar/email/{email}")
    @Operation(summary = "Validar email disponible")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> validarEmail(@PathVariable String email) {
        boolean disponible = !usuarioService.existeEmail(email);
        return ResponseEntity.ok(disponible);
    }

    // =====================================
    // OPTIONS
    // =====================================

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }
}