package com.example.msvc_producto.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class EmpresaRequestDto {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "El RUC es obligatorio")
    @Pattern(regexp = "^[0-9]{13}$", message = "El RUC debe tener 13 dígitos numéricos")
    private String ruc;

    @Size(max = 200, message = "La dirección no puede exceder 200 caracteres")
    private String direccion;

    @Pattern(regexp = "^[0-9]{9,15}$", message = "El teléfono debe tener entre 9 y 15 dígitos")
    private String telefono;

    @Email(message = "El formato del email no es válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;

    private Boolean activo;

    // Constructor vacío
    public EmpresaRequestDto() {
    }

    // Constructor completo
    public EmpresaRequestDto(String nombre, String ruc, String direccion, String telefono, String email, Boolean activo) {
        this.nombre = nombre;
        this.ruc = ruc;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
        this.activo = activo;
    }

    // Getters y setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getRuc() {
        return ruc;
    }

    public void setRuc(String ruc) {
        this.ruc = ruc;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}