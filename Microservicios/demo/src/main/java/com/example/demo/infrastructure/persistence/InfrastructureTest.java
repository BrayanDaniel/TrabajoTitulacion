package com.example.demo.infrastructure.persistence;

import com.example.demo.application.mapper.UsuarioMapper;
import com.example.demo.domain.model.Usuario;
import com.example.demo.domain.service.UsuarioService;
import com.example.demo.infrastructure.persistence.entity.UsuarioEntity;
import com.example.demo.infrastructure.persistence.impl.UsuarioRepositoryImpl;
import com.example.demo.infrastructure.persistence.repository.UsuarioJpaRepository;
import com.example.demo.infrastructure.security.CustomUserDetailsService;
import com.example.demo.infrastructure.security.SecurityConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;

import java.security.KeyPair;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class InfrastructureTest {

    // Mocks para pruebas de UsuarioRepositoryImpl
    @Mock
    private UsuarioJpaRepository usuarioJpaRepository;

    @Mock
    private UsuarioMapper usuarioMapper;

    @InjectMocks
    private UsuarioRepositoryImpl usuarioRepositoryImpl;

    // Mocks para pruebas de CustomUserDetailsService
    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    // Instancia de SecurityConfig para pruebas
    private SecurityConfig securityConfig;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        securityConfig = new SecurityConfig();
    }

    // Tests para UsuarioEntity
    @Test
    void testUsuarioEntityBuilder() {
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
        UsuarioEntity entity = UsuarioEntity.builder()
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
        assertEquals(id, entity.getId());
        assertEquals(username, entity.getUsername());
        assertEquals(password, entity.getPassword());
        assertEquals(email, entity.getEmail());
        assertEquals(nombre, entity.getNombre());
        assertEquals(apellido, entity.getApellido());
        assertEquals(activo, entity.isActivo());
        assertEquals(roles, entity.getRoles());
    }

    @Test
    void testUsuarioEntityNoArgsConstructorAndSetters() {
        // Arrange
        UsuarioEntity entity = new UsuarioEntity();
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
        entity.setId(id);
        entity.setUsername(username);
        entity.setPassword(password);
        entity.setEmail(email);
        entity.setNombre(nombre);
        entity.setApellido(apellido);
        entity.setActivo(activo);
        entity.setRoles(roles);

        // Assert
        assertEquals(id, entity.getId());
        assertEquals(username, entity.getUsername());
        assertEquals(password, entity.getPassword());
        assertEquals(email, entity.getEmail());
        assertEquals(nombre, entity.getNombre());
        assertEquals(apellido, entity.getApellido());
        assertEquals(activo, entity.isActivo());
        assertEquals(roles, entity.getRoles());
    }

    @Test
    void testUsuarioEntityAllArgsConstructor() {
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
        UsuarioEntity entity = new UsuarioEntity(id, username, password, email, nombre, apellido, activo, roles);

        // Assert
        assertEquals(id, entity.getId());
        assertEquals(username, entity.getUsername());
        assertEquals(password, entity.getPassword());
        assertEquals(email, entity.getEmail());
        assertEquals(nombre, entity.getNombre());
        assertEquals(apellido, entity.getApellido());
        assertEquals(activo, entity.isActivo());
        assertEquals(roles, entity.getRoles());
    }

    @Test
    void testUsuarioEntityEqualsAndHashCode() {
        // Arrange
        Set<String> roles1 = new HashSet<>();
        roles1.add("ROLE_USER");

        Set<String> roles2 = new HashSet<>();
        roles2.add("ROLE_USER");

        UsuarioEntity entity1 = UsuarioEntity.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .email("test@example.com")
                .nombre("Test")
                .apellido("User")
                .activo(true)
                .roles(roles1)
                .build();

        UsuarioEntity entity2 = UsuarioEntity.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .email("test@example.com")
                .nombre("Test")
                .apellido("User")
                .activo(true)
                .roles(roles2)
                .build();

        UsuarioEntity entity3 = UsuarioEntity.builder()
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
        assertEquals(entity1, entity2);
        assertNotEquals(entity1, entity3);
        assertEquals(entity1.hashCode(), entity2.hashCode());
        assertNotEquals(entity1.hashCode(), entity3.hashCode());
    }

    // Tests para UsuarioRepositoryImpl
    @Test
    void testRepositoryImplSave() {
        // Arrange
        Usuario domainUsuario = createTestUsuario(null);
        UsuarioEntity entityToSave = createTestEntity(null);
        UsuarioEntity savedEntity = createTestEntity(1L);
        Usuario savedDomainUsuario = createTestUsuario(1L);

        // Uso de lenguaje explícito para resolver la ambigüedad
        when(usuarioMapper.toEntity(any(Usuario.class))).thenReturn(entityToSave);
        when(usuarioJpaRepository.save(any(UsuarioEntity.class))).thenReturn(savedEntity);

        // Especificamos explícitamente que queremos el método que acepta UsuarioEntity
        when(usuarioMapper.toDomain(any(UsuarioEntity.class))).thenReturn(savedDomainUsuario);

        // Act
        Usuario result = usuarioRepositoryImpl.save(domainUsuario);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());

        // Verify - Especificamos los tipos explícitamente
        verify(usuarioMapper).toEntity(any(Usuario.class));
        verify(usuarioJpaRepository).save(any(UsuarioEntity.class));
        verify(usuarioMapper).toDomain(any(UsuarioEntity.class));
    }

    @Test
    void testRepositoryImplFindByUsername_whenExists() {
        // Arrange
        String username = "testuser";
        UsuarioEntity entity = createTestEntity(1L);
        Usuario domainUsuario = createTestUsuario(1L);

        when(usuarioJpaRepository.findByUsername(username)).thenReturn(Optional.of(entity));

        // Especificamos explícitamente que queremos el método que acepta UsuarioEntity
        when(usuarioMapper.toDomain(any(UsuarioEntity.class))).thenReturn(domainUsuario);

        // Act
        Optional<Usuario> result = usuarioRepositoryImpl.findByUsername(username);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(username, result.get().getUsername());

        // Verify
        verify(usuarioJpaRepository).findByUsername(username);
        verify(usuarioMapper).toDomain(any(UsuarioEntity.class));
    }

    @Test
    void testRepositoryImplFindByUsername_whenNotExists() {
        // Arrange
        String username = "nonexistentuser";

        when(usuarioJpaRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> result = usuarioRepositoryImpl.findByUsername(username);

        // Assert
        assertFalse(result.isPresent());

        // Verify
        verify(usuarioJpaRepository).findByUsername(username);
        verify(usuarioMapper, never()).toDomain(any(UsuarioEntity.class));
    }

    @Test
    void testRepositoryImplFindByEmail_whenExists() {
        // Arrange
        String email = "test@example.com";
        UsuarioEntity entity = createTestEntity(1L);
        Usuario domainUsuario = createTestUsuario(1L);

        when(usuarioJpaRepository.findByEmail(email)).thenReturn(Optional.of(entity));

        // Especificamos explícitamente que queremos el método que acepta UsuarioEntity
        when(usuarioMapper.toDomain(any(UsuarioEntity.class))).thenReturn(domainUsuario);

        // Act
        Optional<Usuario> result = usuarioRepositoryImpl.findByEmail(email);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmail());

        // Verify
        verify(usuarioJpaRepository).findByEmail(email);
        verify(usuarioMapper).toDomain(any(UsuarioEntity.class));
    }

    @Test
    void testRepositoryImplFindByEmail_whenNotExists() {
        // Arrange
        String email = "nonexistent@example.com";

        when(usuarioJpaRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> result = usuarioRepositoryImpl.findByEmail(email);

        // Assert
        assertFalse(result.isPresent());

        // Verify
        verify(usuarioJpaRepository).findByEmail(email);
        verify(usuarioMapper, never()).toDomain(any(UsuarioEntity.class));
    }

    @Test
    void testRepositoryImplExistsByUsername() {
        // Arrange
        String username = "testuser";

        when(usuarioJpaRepository.existsByUsername(username)).thenReturn(true);

        // Act
        boolean result = usuarioRepositoryImpl.existsByUsername(username);

        // Assert
        assertTrue(result);

        // Verify
        verify(usuarioJpaRepository).existsByUsername(username);
    }

    @Test
    void testRepositoryImplExistsByEmail() {
        // Arrange
        String email = "test@example.com";

        when(usuarioJpaRepository.existsByEmail(email)).thenReturn(true);

        // Act
        boolean result = usuarioRepositoryImpl.existsByEmail(email);

        // Assert
        assertTrue(result);

        // Verify
        verify(usuarioJpaRepository).existsByEmail(email);
    }

    // Tests para CustomUserDetailsService
    @Test
    void testCustomUserDetailsServiceLoadUserByUsername_whenExists() {
        // Arrange
        String username = "testuser";
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");

        Usuario usuario = Usuario.builder()
                .id(1L)
                .username(username)
                .password("encodedPassword")
                .email("test@example.com")
                .nombre("Test")
                .apellido("User")
                .activo(true)
                .roles(roles)
                .build();

        when(usuarioService.buscarPorUsername(username)).thenReturn(Optional.of(usuario));

        // Act
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

        // Assert
        assertNotNull(userDetails);
        assertEquals(username, userDetails.getUsername());
        assertEquals("encodedPassword", userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
        assertEquals(1, userDetails.getAuthorities().size());
        assertTrue(userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));

        // Verify
        verify(usuarioService).buscarPorUsername(username);
    }

    @Test
    void testCustomUserDetailsServiceLoadUserByUsername_whenNotExists() {
        // Arrange
        String username = "nonexistentuser";

        when(usuarioService.buscarPorUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> {
            customUserDetailsService.loadUserByUsername(username);
        });

        // Verify
        verify(usuarioService).buscarPorUsername(username);
    }

    // Tests para SecurityConfig
    @Test
    void testSecurityConfigPasswordEncoder() {
        // Act
        var passwordEncoder = securityConfig.passwordEncoder();

        // Assert
        assertTrue(passwordEncoder instanceof BCryptPasswordEncoder);

        // Verificamos que el encoder funciona correctamente
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        assertNotEquals(rawPassword, encodedPassword);
        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword));
    }

    @Test
    void testSecurityConfigGenerateRsaKey() {
        // Act
        KeyPair keyPair = securityConfig.generateRsaKey();

        // Assert
        assertNotNull(keyPair);
        assertNotNull(keyPair.getPrivate());
        assertNotNull(keyPair.getPublic());
        assertEquals("RSA", keyPair.getPrivate().getAlgorithm());
        assertEquals("RSA", keyPair.getPublic().getAlgorithm());
    }

    @Test
    void testSecurityConfigJwtComponents() {
        // Arrange
        KeyPair keyPair = securityConfig.generateRsaKey();

        // Act
        JwtDecoder jwtDecoder = securityConfig.jwtDecoder(keyPair);
        JwtEncoder jwtEncoder = securityConfig.jwtEncoder(keyPair);

        // Assert
        assertNotNull(jwtDecoder);
        assertNotNull(jwtEncoder);
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

    private UsuarioEntity createTestEntity(Long id) {
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");

        return UsuarioEntity.builder()
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