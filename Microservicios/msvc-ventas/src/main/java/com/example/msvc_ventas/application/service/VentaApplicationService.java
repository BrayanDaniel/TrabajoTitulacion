package com.example.msvc_ventas.application.service;

import com.example.msvc_ventas.application.client.InventarioClient;
import com.example.msvc_ventas.application.client.ProductoClient;
import com.example.msvc_ventas.application.dto.InventarioInfoDto;
import com.example.msvc_ventas.application.dto.ProductoDto;
import com.example.msvc_ventas.application.dto.VentaItemRequestDto;
import com.example.msvc_ventas.application.dto.VentaRequestDto;
import com.example.msvc_ventas.application.dto.VentaResponseDto;
import com.example.msvc_ventas.application.mapper.VentaMapper;
import com.example.msvc_ventas.domain.model.Cliente;
import com.example.msvc_ventas.domain.model.Venta;
import com.example.msvc_ventas.domain.service.ClienteService;
import com.example.msvc_ventas.domain.service.VentaService;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class VentaApplicationService {

    private final VentaService ventaService;
    private final ClienteService clienteService;
    private final ProductoClient productoClient;
    private final InventarioClient inventarioClient;
    private final VentaMapper ventaMapper;

    @Autowired
    public VentaApplicationService(
            VentaService ventaService,
            ClienteService clienteService,
            @Qualifier("com.example.msvc_ventas.application.client.ProductoClient") ProductoClient productoClient,
            @Qualifier("com.example.msvc_ventas.application.client.InventarioClient") InventarioClient inventarioClient,
            VentaMapper ventaMapper) {
        this.ventaService = ventaService;
        this.clienteService = clienteService;
        this.productoClient = productoClient;
        this.inventarioClient = inventarioClient;
        this.ventaMapper = ventaMapper;
    }

    @Transactional
    public VentaResponseDto crearVenta(VentaRequestDto requestDto) {
        log.info("Iniciando creación de venta para cliente ID: {}", requestDto.getClienteId());

        // 1. Obtener el cliente
        Cliente cliente = clienteService.obtenerClientePorId(requestDto.getClienteId());
        log.info("Cliente encontrado: {}", cliente.getNombre());

        // 2. Obtener los productos
        List<ProductoDto> productos = requestDto.getItems().stream()
                .map(VentaItemRequestDto::getProductoId)
                .distinct()
                .map(id -> {
                    log.info("Consultando producto ID: {}", id);
                    return productoClient.obtenerProducto(id);
                })
                .collect(Collectors.toList());

        log.info("Productos obtenidos: {}", productos.size());

        // 3. Verificar disponibilidad de inventario para cada producto
        for (VentaItemRequestDto item : requestDto.getItems()) {
            ProductoDto producto = productos.stream()
                    .filter(p -> p.getId().equals(item.getProductoId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + item.getProductoId()));

            try {
                // Obtener inventario directamente del microservicio de inventario
                InventarioInfoDto inventario = inventarioClient.obtenerInventarioPorProductoId(item.getProductoId());

                // Verificar si hay suficiente stock
                int cantidadDisponible = (inventario != null) ? inventario.getCantidad() : 0;

                log.info("Verificando inventario para producto: {} (disponible: {}, solicitado: {})",
                        producto.getNombre(), cantidadDisponible, item.getCantidad());

                if (cantidadDisponible < item.getCantidad()) {
                    log.warn("Inventario insuficiente para producto: {}", producto.getNombre());
                    throw new IllegalStateException("Inventario insuficiente para el producto: " +
                            producto.getNombre() + ". Disponible: " + cantidadDisponible +
                            ", Solicitado: " + item.getCantidad());
                }
            } catch (FeignException e) {
                // Si es 404, significa que no existe inventario para este producto
                if (e.status() == 404) {
                    log.error("No existe inventario para el producto ID: {}", item.getProductoId());
                    throw new IllegalStateException("No existe inventario para el producto: " + producto.getNombre());
                }
                log.error("Error al verificar el inventario del producto ID: {}", item.getProductoId(), e);
                throw new RuntimeException("Error al verificar el inventario del producto: " +
                        producto.getNombre(), e);
            }
        }

        // 4. Mapear a entidad de dominio y crear la venta
        Venta venta = ventaMapper.toEntity(requestDto, cliente, productos);
        log.info("Venta mapeada, procediendo a guardar");

        Venta ventaCreada = ventaService.crearVenta(venta);
        log.info("Venta creada con ID: {}", ventaCreada.getId());

        // 5. Mapear de vuelta a DTO para la respuesta
        return ventaMapper.toDto(ventaCreada);
    }
}