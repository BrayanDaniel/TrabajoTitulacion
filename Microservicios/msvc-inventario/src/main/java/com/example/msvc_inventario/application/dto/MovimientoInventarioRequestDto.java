package com.example.msvc_inventario.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class MovimientoInventarioRequestDto {

    @NotNull(message = "El ID del inventario es obligatorio")
    private Long inventarioId;

    @NotBlank(message = "El tipo de movimiento es obligatorio")
    @Pattern(regexp = "^(ENTRADA|SALIDA|AJUSTE)$", message = "El tipo de movimiento debe ser ENTRADA, SALIDA o AJUSTE")
    private String tipoMovimiento;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;

    private String motivo;

    // Constructor vacío
    public MovimientoInventarioRequestDto() {
    }

    // Constructor completo
    public MovimientoInventarioRequestDto(Long inventarioId, String tipoMovimiento, Integer cantidad, String motivo) {
        this.inventarioId = inventarioId;
        this.tipoMovimiento = tipoMovimiento;
        this.cantidad = cantidad;
        this.motivo = motivo;
    }

    // Getters y setters
    public Long getInventarioId() {
        return inventarioId;
    }

    public void setInventarioId(Long inventarioId) {
        this.inventarioId = inventarioId;
    }

    public String getTipoMovimiento() {
        return tipoMovimiento;
    }

    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}