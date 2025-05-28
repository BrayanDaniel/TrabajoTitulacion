package com.example.msvc_ventas.domain.repository;

import com.example.msvc_ventas.domain.model.DetalleVenta;

import java.util.List;
import java.util.Optional;

public interface DetalleVentaRepository {
    DetalleVenta save(DetalleVenta detalleVenta);
    List<DetalleVenta> saveAll(List<DetalleVenta> detalles);
    Optional<DetalleVenta> findById(Long id);
    List<DetalleVenta> findByVentaId(Long ventaId);
}