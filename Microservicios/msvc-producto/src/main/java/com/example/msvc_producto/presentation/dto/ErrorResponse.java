package com.example.msvc_producto.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private String codigo;
    private String mensaje;
    private LocalDateTime timestamp;

    public ErrorResponse(String codigo, String mensaje) {
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.timestamp = LocalDateTime.now();
    }
}