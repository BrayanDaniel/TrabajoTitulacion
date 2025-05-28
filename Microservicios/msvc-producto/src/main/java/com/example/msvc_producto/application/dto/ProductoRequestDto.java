package com.example.msvc_producto.application.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductoRequestDto {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio debe ser mayor o igual a 0")
    @Digits(integer = 10, fraction = 2, message = "El precio debe tener máximo 10 dígitos enteros y 2 decimales")
    private BigDecimal precio;


    @Size(max = 255, message = "La URL de la imagen no puede exceder 255 caracteres")
    private String imagen;

    private Boolean activo;

    @NotNull(message = "El ID de la empresa es obligatorio")
    @Positive(message = "El ID de empresa debe ser un número positivo")
    private Long empresaId;

    @NotNull(message = "El ID de la categoría es obligatorio")
    @Positive(message = "El ID de categoría debe ser un número positivo")
    private Long categoriaId;

    // Constructor vacío
    public ProductoRequestDto() {
    }

    // Constructor actualizado
    public ProductoRequestDto(String nombre, String descripcion, BigDecimal precio,
                              String imagen, Boolean activo,
                              Long empresaId, Long categoriaId) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.activo = activo;
        this.empresaId = empresaId;
        this.categoriaId = categoriaId;
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

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public Long getEmpresaId() {
        return empresaId;
    }

    public void setEmpresaId(Long empresaId) {
        this.empresaId = empresaId;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }
}