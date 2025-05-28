package com.example.msvc_producto.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductoResponseDto {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private String imagen;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private EmpresaResponseDto empresa;
    private CategoriaResponseDto categoria;
    private InventarioInfoDto inventario; // Información básica del inventario

    // Constructor vacío
    public ProductoResponseDto() {
    }

    // Getters y setters (eliminados los de stock)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public EmpresaResponseDto getEmpresa() {
        return empresa;
    }

    public void setEmpresa(EmpresaResponseDto empresa) {
        this.empresa = empresa;
    }

    public CategoriaResponseDto getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaResponseDto categoria) {
        this.categoria = categoria;
    }

    public InventarioInfoDto getInventario() {
        return inventario;
    }

    public void setInventario(InventarioInfoDto inventario) {
        this.inventario = inventario;
    }

}