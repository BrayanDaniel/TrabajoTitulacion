package com.example.msvc_producto.domain.service;

import com.example.msvc_producto.application.dto.ProductoListadoDto;
import com.example.msvc_producto.domain.model.Producto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductoService {
    Producto crearProducto(Producto producto);
    Producto actualizarProducto(Long id, Producto producto);
    Producto obtenerProductoPorId(Long id);
    List<Producto> listarProductos();
    List<Producto> buscarProductosPorEmpresa(Long empresaId);
    List<Producto> buscarProductosPorCategoria(Long categoriaId);
    void eliminarProducto(Long id);

    @Transactional(readOnly = true)
    List<ProductoListadoDto> listarProductosOptimizado();

    @Transactional(readOnly = true)
    List<ProductoListadoDto> obtenerProductosOptimizado();

}