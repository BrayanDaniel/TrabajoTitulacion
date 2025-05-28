package com.example.msvc_ventas.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VentaResponseDto {
    private Long id;
    private String numeroFactura;
    private ClienteResponseDto cliente;
    private BigDecimal subtotal;
    private BigDecimal impuesto;
    private BigDecimal total;
    private String estado;
    private LocalDateTime fechaVenta;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private List<DetalleVentaResponseDto> detalles;
}