package com.example.demo.domain.service;

import com.example.demo.domain.model.Usuario;
import com.example.demo.domain.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UsuarioTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Tests para el modelo Usuario
    @Test
    void testUsuarioBuilder() {
        // Arrange
        Long id = 1L;
        String username = "testuser";
        String password = "password123";
        String email = "test@example.com";
        String nombre = "Test";
        String apellido = "User";
        boolean activo = true;
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");

        // Act
        Usuario usuario = Usuario.builder()
                .id(id)
                .username(username)
                .password(password)
                .email(email)
                .nombre(nombre)
                .apellido(apellido)
                .activo(activo)
                .roles(roles)
                .build();

        // Assert
        assertEquals(id, usuario.getId());
        assertEquals(username, usuario.getUsername());
        assertEquals(password, usuario.getPassword());
        assertEquals(email, usuario.getEmail());
        assertEquals(nombre, usuario.getNombre());
        assertEquals(apellido, usuario.getApellido());
        assertEquals(activo, usuario.isActivo());
        assertEquals(roles, usuario.getRoles());
    }

    @Test
    void testUsuarioNoArgsConstructorAndSetters() {
        // Arrange
        Usuario usuario = new Usuario();
        Long id = 1L;
        String username = "testuser";
        String password = "password123";
        String email = "test@example.com";
        String nombre = "Test";
        String apellido = "User";
        boolean activo = true;
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");

        // Act
        usuario.setId(id);
        usuario.setUsername(username);
        usuario.setPassword(password);
        usuario.setEmail(email);
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setActivo(activo);
        usuario.setRoles(roles);

        // Assert
        assertEquals(id, usuario.getId());
        assertEquals(username, usuario.getUsername());
        assertEquals(password, usuario.getPassword());
        assertEquals(email, usuario.getEmail());
        assertEquals(nombre, usuario.getNombre());
        assertEquals(apellido, usuario.getApellido());
        assertEquals(activo, usuario.isActivo());
        assertEquals(roles, usuario.getRoles());
    }

    @Test
    void testUsuarioAllArgsConstructor() {
        // Arrange
        Long id = 1L;
        String username = "testuser";
        String password = "password123";
        String email = "test@example.com";
        String nombre = "Test";
        String apellido = "User";
        boolean activo = true;
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");

        // Act
        Usuario usuario = new Usuario(id, username, password, email, nombre, apellido, activo, roles);

        // Assert
        assertEquals(id, usuario.getId());
        assertEquals(username, usuario.getUsername());
        assertEquals(password, usuario.getPassword());
        assertEquals(email, usuario.getEmail());
        assertEquals(nombre, usuario.getNombre());
        assertEquals(apellido, usuario.getApellido());
        assertEquals(activo, usuario.isActivo());
        assertEquals(roles, usuario.getRoles());
    }

    @Test
    void testEqualsAndHashCode() {
        // Arrange
        Set<String> roles1 = new HashSet<>();
        roles1.add("ROLE_USER");

        Set<String> roles2 = new HashSet<>();
        roles2.add("ROLE_USER");

        Usuario usuario1 = Usuario.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .email("test@example.com")
                .nombre("Test")
                .apellido("User")
                .activo(true)
                .roles(roles1)
                .build();

        Usuario usuario2 = Usuario.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .email("test@example.com")
                .nombre("Test")
                .apellido("User")
                .activo(true)
                .roles(roles2)
                .build();

        Usuario usuario3 = Usuario.builder()
                .id(2L)
                .username("otheruser")
                .password("password456")
                .email("other@example.com")
                .nombre("Other")
                .apellido("User")
                .activo(true)
                .roles(roles1)
                .build();

        // Assert
        assertEquals(usuario1, usuario2);
        assertNotEquals(usuario1, usuario3);
        assertEquals(usuario1.hashCode(), usuario2.hashCode());
        assertNotEquals(usuario1.hashCode(), usuario3.hashCode());
    }

    @Test
    void testToString() {
        // Arrange
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");

        Usuario usuario = Usuario.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .email("test@example.com")
                .nombre("Test")
                .apellido("User")
                .activo(true)
                .roles(roles)
                .build();

        // Act
        String toStringResult = usuario.toString();

        // Assert
        assertTrue(toStringResult.contains("id=1"));
        assertTrue(toStringResult.contains("username=testuser"));
        assertTrue(toStringResult.contains("password=password123"));
        assertTrue(toStringResult.contains("email=test@example.com"));
        assertTrue(toStringResult.contains("nombre=Test"));
        assertTrue(toStringResult.contains("apellido=User"));
        assertTrue(toStringResult.contains("activo=true"));
        assertTrue(toStringResult.contains("roles=[ROLE_USER]") ||
                toStringResult.contains("roles={ROLE_USER}"));
    }

    // Tests para UsuarioRepository
    @Test
    void testRepositorySave() {
        // Arrange
        Usuario input = createTestUsuario(null);
        Usuario output = createTestUsuario(1L);

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(output);

        // Act
        Usuario result = usuarioRepository.save(input);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("testuser", result.getUsername());

        // Verify
        verify(usuarioRepository).save(input);
    }

    @Test
    void testRepositoryFindByUsername_whenExists() {
        // Arrange
        String username = "testuser";
        Usuario usuario = createTestUsuario(1L);

        when(usuarioRepository.findByUsername(username)).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> result = usuarioRepository.findByUsername(username);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(username, result.get().getUsername());

        // Verify
        verify(usuarioRepository).findByUsername(username);
    }

    @Test
    void testRepositoryFindByUsername_whenNotExists() {
        // Arrange
        String username = "nonexistentuser";

        when(usuarioRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> result = usuarioRepository.findByUsername(username);

        // Assert
        assertFalse(result.isPresent());

        // Verify
        verify(usuarioRepository).findByUsername(username);
    }

    @Test
    void testRepositoryFindByEmail_whenExists() {
        // Arrange
        String email = "test@example.com";
        Usuario usuario = createTestUsuario(1L);

        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> result = usuarioRepository.findByEmail(email);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmail());

        // Verify
        verify(usuarioRepository).findByEmail(email);
    }

    @Test
    void testRepositoryFindByEmail_whenNotExists() {
        // Arrange
        String email = "nonexistent@example.com";

        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> result = usuarioRepository.findByEmail(email);

        // Assert
        assertFalse(result.isPresent());

        // Verify
        verify(usuarioRepository).findByEmail(email);
    }

    @Test
    void testRepositoryExistsByUsername_whenTrue() {
        // Arrange
        String username = "existinguser";

        when(usuarioRepository.existsByUsername(username)).thenReturn(true);

        // Act
        boolean result = usuarioRepository.existsByUsername(username);

        // Assert
        assertTrue(result);

        // Verify
        verify(usuarioRepository).existsByUsername(username);
    }

    @Test
    void testRepositoryExistsByUsername_whenFalse() {
        // Arrange
        String username = "nonexistentuser";

        when(usuarioRepository.existsByUsername(username)).thenReturn(false);

        // Act
        boolean result = usuarioRepository.existsByUsername(username);

        // Assert
        assertFalse(result);

        // Verify
        verify(usuarioRepository).existsByUsername(username);
    }

    @Test
    void testRepositoryExistsByEmail_whenTrue() {
        // Arrange
        String email = "existing@example.com";

        when(usuarioRepository.existsByEmail(email)).thenReturn(true);

        // Act
        boolean result = usuarioRepository.existsByEmail(email);

        // Assert
        assertTrue(result);

        // Verify
        verify(usuarioRepository).existsByEmail(email);
    }

    @Test
    void testRepositoryExistsByEmail_whenFalse() {
        // Arrange
        String email = "nonexistent@example.com";

        when(usuarioRepository.existsByEmail(email)).thenReturn(false);

        // Act
        boolean result = usuarioRepository.existsByEmail(email);

        // Assert
        assertFalse(result);

        // Verify
        verify(usuarioRepository).existsByEmail(email);
    }

    // Tests para UsuarioService
    @Test
    void testServiceRegistrarUsuario() {
        // Arrange
        Usuario input = createTestUsuario(null);
        Usuario output = createTestUsuario(1L);

        when(usuarioService.registrarUsuario(any(Usuario.class))).thenReturn(output);

        // Act
        Usuario result = usuarioService.registrarUsuario(input);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("testuser", result.getUsername());

        // Verify
        verify(usuarioService).registrarUsuario(input);
    }

    @Test
    void testServiceBuscarPorUsername_whenExists() {
        // Arrange
        String username = "testuser";
        Usuario usuario = createTestUsuario(1L);

        when(usuarioService.buscarPorUsername(username)).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> result = usuarioService.buscarPorUsername(username);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(username, result.get().getUsername());

        // Verify
        verify(usuarioService).buscarPorUsername(username);
    }

    @Test
    void testServiceBuscarPorUsername_whenNotExists() {
        // Arrange
        String username = "nonexistentuser";

        when(usuarioService.buscarPorUsername(username)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> result = usuarioService.buscarPorUsername(username);

        // Assert
        assertFalse(result.isPresent());

        // Verify
        verify(usuarioService).buscarPorUsername(username);
    }

    @Test
    void testServiceExisteUsername_whenTrue() {
        // Arrange
        String username = "existinguser";

        when(usuarioService.existeUsername(username)).thenReturn(true);

        // Act
        boolean result = usuarioService.existeUsername(username);

        // Assert
        assertTrue(result);

        // Verify
        verify(usuarioService).existeUsername(username);
    }

    @Test
    void testServiceExisteUsername_whenFalse() {
        // Arrange
        String username = "nonexistentuser";

        when(usuarioService.existeUsername(username)).thenReturn(false);

        // Act
        boolean result = usuarioService.existeUsername(username);

        // Assert
        assertFalse(result);

        // Verify
        verify(usuarioService).existeUsername(username);
    }

    @Test
    void testServiceExisteEmail_whenTrue() {
        // Arrange
        String email = "existing@example.com";

        when(usuarioService.existeEmail(email)).thenReturn(true);

        // Act
        boolean result = usuarioService.existeEmail(email);

        // Assert
        assertTrue(result);

        // Verify
        verify(usuarioService).existeEmail(email);
    }

    @Test
    void testServiceExisteEmail_whenFalse() {
        // Arrange
        String email = "nonexistent@example.com";

        when(usuarioService.existeEmail(email)).thenReturn(false);

        // Act
        boolean result = usuarioService.existeEmail(email);

        // Assert
        assertFalse(result);

        // Verify
        verify(usuarioService).existeEmail(email);
    }

    // Helper method
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
}