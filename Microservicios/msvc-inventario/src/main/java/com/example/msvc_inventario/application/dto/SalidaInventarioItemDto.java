package com.example.msvc_inventario.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para representar un item individual en una salida de inventario
 * Se usa cuando se procesan múltiples salidas en lote (por ejemplo, en una venta)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalidaInventarioItemDto {

    @NotNull(message = "El ID del producto es requerido")
    private Long productoId;

    @NotNull(message = "La cantidad es requerida")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;

    /**
     * Método getter personalizado para compatibilidad
     * @return el ID del producto
     */
    public Long getProductoId() {
        return productoId;
    }

    /**
     * Método getter personalizado para compatibilidad
     * @return la cantidad
     */
    public Integer getCantidad() {
        return cantidad;
    }
}