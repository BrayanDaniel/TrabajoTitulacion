package com.example.msvc_inventario.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_inventario")
public class MovimientoInventarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inventario_id", nullable = false)
    private Long inventarioId;

    @Column(name = "tipo_movimiento", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TipoMovimiento tipoMovimiento;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(length = 200)
    private String motivo;

    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDateTime fechaMovimiento;

    @Column(name = "usuario_id")
    private Long usuarioId;

    // Enum para los tipos de movimientos
    public enum TipoMovimiento {
        ENTRADA,
        SALIDA,
        AJUSTE
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