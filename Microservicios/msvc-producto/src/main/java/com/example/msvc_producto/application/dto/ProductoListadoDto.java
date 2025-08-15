package com.example.msvc_producto.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoListadoDto {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagen;
    private String categoriaNombre;
    private String empresaNombre;

    // Campos para inventario (se llenarán después)
    private Integer inventarioCantidad;

    // Constructor para query nativa (sin inventario y sin IDs de relaciones)
    public ProductoListadoDto(Long id, String nombre, String descripcion, Double precio,
                              String imagen, String categoriaNombre, String empresaNombre) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.categoriaNombre = categoriaNombre;
        this.empresaNombre = empresaNombre;
        this.inventarioCantidad = 0;
    }
}