package com.example.demo.application.dto;

import lombok.Data;
import java.util.Set;

@Data
public class RegistroUsuarioAdminDto {
    private String username;
    private String password;
    private String email;
    private String nombre;
    private String apellido;
    private Set<String> roles; // ✅ Campo adicional para roles
}