package com.example.demo.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String nombre;
    private String apellido;
    private boolean activo;
    private Set<String> roles;
}