package com.example.demo.application.dto;

import lombok.Data;

@Data
public class RegistroUsuarioDto {
    private String username;
    private String password;
    private String email;
    private String nombre;
    private String apellido;
}