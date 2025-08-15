/*package com.example.demo.presentation.controller;

import com.example.demo.application.dto.LoginRequestDto;
import com.example.demo.application.dto.RegistroUsuarioDto;
import com.example.demo.application.dto.TokenResponseDto;
import com.example.demo.application.dto.UsuarioResponseDto;
import com.example.demo.application.mapper.UsuarioMapper;
import com.example.demo.application.service.AuthService;
import com.example.demo.domain.model.Usuario;
import com.example.demo.domain.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private AuthService authService;

    @Mock
    private UsuarioMapper usuarioMapper;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegistrarUsuario_exitoso() {
        // Arrange
        RegistroUsuarioDto registroDto = new RegistroUsuarioDto();
        registroDto.setUsername("testuser");
        registroDto.setPassword("password123");
        registroDto.setEmail("test@example.com");
        registroDto.setNombre("Test");
        registroDto.setApellido("User");

        Usuario usuario = createTestUsuario(null);
        Usuario usuarioRegistrado = createTestUsuario(1L);
        UsuarioResponseDto responseDto = createTestUsuarioResponseDto();

        when(usuarioService.existeUsername(registroDto.getUsername())).thenReturn(false);
        when(usuarioService.existeEmail(registroDto.getEmail())).thenReturn(false);
        when(usuarioMapper.toDomain(any(RegistroUsuarioDto.class))).thenReturn(usuario);
        when(usuarioService.registrarUsuario(usuario)).thenReturn(usuarioRegistrado);
        when(usuarioMapper.toResponseDto(usuarioRegistrado)).thenReturn(responseDto);

        // Act
        ResponseEntity<UsuarioResponseDto> response = authController.registrarUsuario(registroDto);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("testuser", response.getBody().getUsername());
        assertEquals("test@example.com", response.getBody().getEmail());

        // Verify
        verify(usuarioService).existeUsername(registroDto.getUsername());
        verify(usuarioService).existeEmail(registroDto.getEmail());
        verify(usuarioMapper).toDomain(any(RegistroUsuarioDto.class));
        verify(usuarioService).registrarUsuario(usuario);
        verify(usuarioMapper).toResponseDto(usuarioRegistrado);
    }

    @Test
    void testRegistrarUsuario_usernameExistente() {
        // Arrange
        RegistroUsuarioDto registroDto = new RegistroUsuarioDto();
        registroDto.setUsername("existinguser");
        registroDto.setPassword("password123");
        registroDto.setEmail("test@example.com");
        registroDto.setNombre("Test");
        registroDto.setApellido("User");

        when(usuarioService.existeUsername(registroDto.getUsername())).thenReturn(true);

        // Act
        ResponseEntity<UsuarioResponseDto> response = authController.registrarUsuario(registroDto);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        // Verify
        verify(usuarioService).existeUsername(registroDto.getUsername());
        verify(usuarioService, never()).existeEmail(anyString());
        verify(usuarioMapper, never()).toDomain(any(RegistroUsuarioDto.class));
        verify(usuarioService, never()).registrarUsuario(any(Usuario.class));
        verify(usuarioMapper, never()).toResponseDto(any(Usuario.class));
    }

    @Test
    void testRegistrarUsuario_emailExistente() {
        // Arrange
        RegistroUsuarioDto registroDto = new RegistroUsuarioDto();
        registroDto.setUsername("testuser");
        registroDto.setPassword("password123");
        registroDto.setEmail("existing@example.com");
        registroDto.setNombre("Test");
        registroDto.setApellido("User");

        when(usuarioService.existeUsername(registroDto.getUsername())).thenReturn(false);
        when(usuarioService.existeEmail(registroDto.getEmail())).thenReturn(true);

        // Act
        ResponseEntity<UsuarioResponseDto> response = authController.registrarUsuario(registroDto);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        // Verify
        verify(usuarioService).existeUsername(registroDto.getUsername());
        verify(usuarioService).existeEmail(registroDto.getEmail());
        verify(usuarioMapper, never()).toDomain(any(RegistroUsuarioDto.class));
        verify(usuarioService, never()).registrarUsuario(any(Usuario.class));
        verify(usuarioMapper, never()).toResponseDto(any(Usuario.class));
    }

    @Test
    void testLogin_exitoso() {
        // Arrange
        LoginRequestDto loginRequestDto = new LoginRequestDto();
        //loginRequestDto.setUsername("testuser");
        //loginRequestDto.setPassword("password123");

        TokenResponseDto expectedToken = new TokenResponseDto();
        expectedToken.setAccessToken("test-token");
        expectedToken.setTokenType("Bearer");
        expectedToken.setExpiresIn(3600L);

        when(authService.login(loginRequestDto)).thenReturn(expectedToken);

        // Act
        ResponseEntity<TokenResponseDto> response = authController.login(loginRequestDto);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("test-token", response.getBody().getAccessToken());
        assertEquals("Bearer", response.getBody().getTokenType());
        assertEquals(3600L, response.getBody().getExpiresIn());

        // Verify
        verify(authService).login(loginRequestDto);
    }

    // Helper methods
    private Usuario createTestUsuario(Long id) {
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");

        return Usuario.builder()
                .id(id)
                .username("testuser")
                .password("password123")
                .email("test@example.com")
                .nombre("Test")
                .apellido("User")
                .activo(true)
                .roles(roles)
                .build();
    }

    private UsuarioResponseDto createTestUsuarioResponseDto() {
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");

        UsuarioResponseDto dto = new UsuarioResponseDto();
        dto.setId(1L);
        dto.setUsername("testuser");
        dto.setEmail("test@example.com");
        dto.setNombre("Test");
        dto.setApellido("User");
        dto.setRoles(roles);
        return dto;
    }
}*/