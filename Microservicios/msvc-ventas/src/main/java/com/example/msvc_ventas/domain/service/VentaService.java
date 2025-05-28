package com.example.msvc_ventas.domain.service;

import com.example.msvc_ventas.domain.model.Venta;

import java.util.List;

public interface VentaService {
    Venta crearVenta(Venta venta);
    Venta actualizarVenta(Long id, Venta venta);
    Venta obtenerVentaPorId(Long id);
    Venta obtenerVentaPorNumeroFactura(String numeroFactura);
    List<Venta> listarVentasPorCliente(Long clienteId);
    List<Venta> listarVentas();
    Venta completarVenta(Long id);
    Venta cancelarVenta(Long id);
}