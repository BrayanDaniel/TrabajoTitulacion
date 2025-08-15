package com.example.msvc_ventas.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para representar un item individual en la solicitud de venta
 * Coincide exactamente con lo que envía el frontend
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VentaItemRequestDto {

    @NotNull(message = "El ID del producto es obligatorio")
    private Long productoId;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;

    // Nota: precioUnitario se omite aquí ya que se obtendrá del microservicio de productos
    // para garantizar la integridad de los precios
}