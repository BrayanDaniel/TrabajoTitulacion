package com.example.msvc_producto.domain.service;

import com.example.msvc_producto.domain.model.Producto;

import java.util.List;

public interface ProductoService {
    Producto crearProducto(Producto producto);
    Producto actualizarProducto(Long id, Producto producto);
    Producto obtenerProductoPorId(Long id);
    List<Producto> listarProductos();
    List<Producto> buscarProductosPorEmpresa(Long empresaId);
    List<Producto> buscarProductosPorCategoria(Long categoriaId);
    void eliminarProducto(Long id);

    // El método actualizarStockProducto se elimina porque la gestión del stock
    // es responsabilidad exclusiva del microservicio de inventario
}