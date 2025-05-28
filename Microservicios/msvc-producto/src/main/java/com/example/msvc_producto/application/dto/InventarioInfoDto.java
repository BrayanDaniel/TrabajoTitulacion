package com.example.msvc_producto.application.dto;

public class InventarioInfoDto {
    private Long id;
    private Integer cantidad;
    private String ubicacion;

    // Constructor vacío
    public InventarioInfoDto() {
    }

    // Constructor completo
    public InventarioInfoDto(Long id, Integer cantidad, String ubicacion) {
        this.id = id;
        this.cantidad = cantidad;
        this.ubicacion = ubicacion;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}