package com.example.demo.presentation.controller;

import com.example.demo.application.dto.LoginRequestDto;
import com.example.demo.application.dto.RegistroUsuarioDto;
import com.example.demo.application.dto.TokenResponseDto;
import com.example.demo.application.dto.UsuarioResponseDto;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@Tag(name = "Autenticación", description = "API para registro y autenticación de usuarios")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthService authService;
    private final UsuarioMapper usuarioMapper;

    @PostMapping("/registro")
    @Operation(summary = "Registrar un nuevo usuario",
            description = "Crea un nuevo usuario en el sistema con los datos proporcionados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuario creado correctamente",
                    content = @Content(schema = @Schema(implementation = UsuarioResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Username o email ya existen",
                    content = @Content)
    })
    public ResponseEntity<UsuarioResponseDto> registrarUsuario(@Valid @RequestBody RegistroUsuarioDto registroDto) {
        // Validar si ya existe el username o email
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

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión",
            description = "Autentica al usuario y devuelve un token JWT válido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticación exitosa",
                    content = @Content(schema = @Schema(implementation = TokenResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas",
                    content = @Content)
    })
    public ResponseEntity<TokenResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        TokenResponseDto tokenResponse = authService.login(loginRequest);
        return ResponseEntity.ok(tokenResponse);
    }

    // Manejar preflight OPTIONS requests
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }
}