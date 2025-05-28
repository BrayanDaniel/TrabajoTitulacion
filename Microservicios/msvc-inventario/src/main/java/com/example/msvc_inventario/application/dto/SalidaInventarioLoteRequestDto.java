package com.example.msvc_inventario.application.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public class SalidaInventarioLoteRequestDto {

    @NotEmpty(message = "La lista de items no puede estar vacía")
    @Size(min = 1, message = "Debe haber al menos un item en la lista")
    private List<SalidaInventarioItemDto> items;

    private String motivo;

    // Constructor vacío
    public SalidaInventarioLoteRequestDto() {
    }

    // Getters y setters
    public List<SalidaInventarioItemDto> getItems() {
        return items;
    }

    public void setItems(List<SalidaInventarioItemDto> items) {
        this.items = items;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    // Clase interna para cada item
    public static class SalidaInventarioItemDto {
        private Long productoId;
        private Integer cantidad;

        // Constructor vacío
        public SalidaInventarioItemDto() {
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
    }
}