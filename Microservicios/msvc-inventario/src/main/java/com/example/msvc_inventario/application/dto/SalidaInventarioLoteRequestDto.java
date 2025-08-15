package com.example.msvc_inventario.application.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para procesar salidas de inventario en lote
 * Se usa típicamente cuando se confirma una venta con múltiples productos
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalidaInventarioLoteRequestDto {

    @NotEmpty(message = "Debe incluir al menos un item")
    @Valid
    private List<SalidaInventarioItemDto> items;

    private String motivo;

    /**
     * Método getter para compatibilidad
     * @return la lista de items
     */
    public List<SalidaInventarioItemDto> getItems() {
        return items;
    }

    /**
     * Método getter para compatibilidad
     * @return el motivo
     */
    public String getMotivo() {
        return motivo;
    }
}