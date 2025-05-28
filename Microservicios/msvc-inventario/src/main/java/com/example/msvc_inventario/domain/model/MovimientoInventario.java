package com.example.msvc_inventario.domain.model;

import java.time.LocalDateTime;

public class MovimientoInventario {
    private Long id;
    private Long inventarioId;
    private TipoMovimiento tipoMovimiento;
    private Integer cantidad;
    private String motivo;
    private LocalDateTime fechaMovimiento;
    private Long usuarioId;

    // Enum para los tipos de movimientos
    public enum TipoMovimiento {
        ENTRADA,
        SALIDA,
        AJUSTE
    }

    // Constructor vacío
    public MovimientoInventario() {
    }

    // Constructor completo
    public MovimientoInventario(Long id, Long inventarioId, TipoMovimiento tipoMovimiento,
                                Integer cantidad, String motivo, LocalDateTime fechaMovimiento, Long usuarioId) {
        this.id = id;
        this.inventarioId = inventarioId;
        this.tipoMovimiento = tipoMovimiento;
        this.cantidad = cantidad;
        this.motivo = motivo;
        this.fechaMovimiento = fechaMovimiento;
        this.usuarioId = usuarioId;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInventarioId() {
        return inventarioId;
    }

    public void setInventarioId(Long inventarioId) {
        this.inventarioId = inventarioId;
    }

    public TipoMovimiento getTipoMovimiento() {
        return tipoMovimiento;
    }

    public void setTipoMovimiento(TipoMovimiento tipoMovimiento) {
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

    public LocalDateTime getFechaMovimiento() {
        return fechaMovimiento;
    }

    public void setFechaMovimiento(LocalDateTime fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}