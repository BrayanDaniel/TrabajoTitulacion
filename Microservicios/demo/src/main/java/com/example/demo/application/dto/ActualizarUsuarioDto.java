
// =====================================
// ActualizarUsuarioDto.java
// =====================================
package com.example.demo.application.dto;

import lombok.Data;
import java.util.Set;

@Data
public class ActualizarUsuarioDto {
    private String username;
    private String email;
    private String nombre;
    private String apellido;
    private String password;
    private Set<String> roles;
}