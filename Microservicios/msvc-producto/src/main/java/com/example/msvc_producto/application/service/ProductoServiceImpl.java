package com.example.msvc_producto.application.service;

import com.example.msvc_producto.application.client.InventarioClient;
import com.example.msvc_producto.domain.model.Categoria;
import com.example.msvc_producto.domain.model.Empresa;
import com.example.msvc_producto.domain.model.Producto;
import com.example.msvc_producto.domain.repository.ProductoRepository;
import com.example.msvc_producto.domain.service.CategoriaService;
import com.example.msvc_producto.domain.service.EmpresaService;
import com.example.msvc_producto.domain.service.ProductoService;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final EmpresaService empresaService;
    private final CategoriaService categoriaService;
    private final InventarioClient inventarioClient;

    public ProductoServiceImpl(
            ProductoRepository productoRepository,
            EmpresaService empresaService,
            CategoriaService categoriaService,
            @Qualifier("com.example.msvc_producto.application.client.InventarioClient") InventarioClient inventarioClient) {
        this.productoRepository = productoRepository;
        this.empresaService = empresaService;
        this.categoriaService = categoriaService;
        this.inventarioClient = inventarioClient;
    }

    @Override
    @Transactional
    public Producto crearProducto(Producto producto) {
        // Verificar que la empresa existe
        Empresa empresa = empresaService.obtenerEmpresaPorId(producto.getEmpresa().getId());
        producto.setEmpresa(empresa);

        // Verificar que la categoría existe
        Categoria categoria = categoriaService.obtenerCategoriaPorId(producto.getCategoria().getId());
        producto.setCategoria(categoria);

        producto.setFechaCreacion(LocalDateTime.now());
        producto.setFechaActualizacion(LocalDateTime.now());
        producto.setActivo(true);

        Producto productoGuardado = productoRepository.save(producto);

        // Crear registro en inventario (si el microservicio está disponible)
        try {
            // Enviar un stock inicial de 0 al inventario
            inventarioClient.crearInventarioParaProducto(productoGuardado.getId(), 0);
        } catch (FeignException e) {
            // Loguear error pero continuar con la creación del producto
            System.out.println("No se pudo crear el inventario para el producto: " + e.getMessage());
        }

        return productoGuardado;
    }

    @Override
    @Transactional
    public Producto actualizarProducto(Long id, Producto producto) {
        Producto productoExistente = obtenerProductoPorId(id);

        // Verificar que la empresa existe
        Empresa empresa = empresaService.obtenerEmpresaPorId(producto.getEmpresa().getId());

        // Verificar que la categoría existe
        Categoria categoria = categoriaService.obtenerCategoriaPorId(producto.getCategoria().getId());

        productoExistente.setNombre(producto.getNombre());
        productoExistente.setDescripcion(producto.getDescripcion());
        productoExistente.setPrecio(producto.getPrecio());
        productoExistente.setImagen(producto.getImagen());
        productoExistente.setActivo(producto.getActivo());
        productoExistente.setEmpresa(empresa);
        productoExistente.setCategoria(categoria);
        productoExistente.setFechaActualizacion(LocalDateTime.now());

        return productoRepository.save(productoExistente);
        // Ya no actualizamos el stock en el inventario desde aquí
    }

    @Override
    @Transactional(readOnly = true)
    public Producto obtenerProductoPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> buscarProductosPorEmpresa(Long empresaId) {
        return productoRepository.findByEmpresaId(empresaId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> buscarProductosPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @Override
    @Transactional
    public void eliminarProducto(Long id) {
        Producto producto = obtenerProductoPorId(id);
        producto.setActivo(false);
        producto.setFechaActualizacion(LocalDateTime.now());
        productoRepository.save(producto);
    }

}