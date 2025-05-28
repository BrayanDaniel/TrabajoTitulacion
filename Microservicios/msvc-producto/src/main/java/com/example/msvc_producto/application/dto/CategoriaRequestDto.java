package com.example.msvc_producto.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoriaRequestDto {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;

    @Size(max = 250, message = "La descripción no puede exceder 250 caracteres")
    private String descripcion;

    private Boolean activo;

    // Constructor vacío
    public CategoriaRequestDto() {
    }



    // Constructor completo
    public CategoriaRequestDto(String nombre, String descripcion, Boolean activo) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.activo = activo;
    }

    // Getters y setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}