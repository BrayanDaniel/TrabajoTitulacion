package com.example.msvc_ventas.domain.repository;

import com.example.msvc_ventas.domain.model.Venta;

import java.util.List;
import java.util.Optional;

public interface VentaRepository {
    Venta save(Venta venta);
    Optional<Venta> findById(Long id);
    Optional<Venta> findByNumeroFactura(String numeroFactura);
    List<Venta> findByClienteId(Long clienteId);
    List<Venta> findAll();
}