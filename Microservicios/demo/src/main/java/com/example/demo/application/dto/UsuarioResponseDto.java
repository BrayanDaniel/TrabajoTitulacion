package com.example.demo.application.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UsuarioResponseDto {
    private Long id;
    private String username;
    private String email;
    private String nombre;
    private String apellido;
    private Set<String> roles;
}