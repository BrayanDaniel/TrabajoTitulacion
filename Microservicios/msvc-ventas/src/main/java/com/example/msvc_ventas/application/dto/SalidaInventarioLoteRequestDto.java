package com.example.msvc_ventas.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SalidaInventarioLoteRequestDto {

    private List<SalidaInventarioItemDto> items;
    private String motivo;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SalidaInventarioItemDto {
        private Long productoId;
        private Integer cantidad;
    }
}