package com.example.msvc_inventario.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class InventarioRequestDto {

    @NotNull(message = "El ID del producto es obligatorio")
    private Long productoId;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 0, message = "La cantidad debe ser mayor o igual a 0")
    private Integer cantidad;

    private String ubicacion;

    private Boolean activo;

    // Constructor vacío
    public InventarioRequestDto() {
    }

    // Constructor completo
    public InventarioRequestDto(Long productoId, Integer cantidad, String ubicacion, Boolean activo) {
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.ubicacion = ubicacion;
        this.activo = activo;
    }

    // Getters y setters
    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}