package com.example.msvc_ventas.application.service;

import com.example.msvc_ventas.application.client.InventarioClient;
import com.example.msvc_ventas.application.client.ProductoClient;
import com.example.msvc_ventas.application.dto.InventarioInfoDto;
import com.example.msvc_ventas.application.dto.ProductoDto;
import com.example.msvc_ventas.application.dto.SalidaInventarioLoteRequestDto;
import com.example.msvc_ventas.domain.model.Cliente;
import com.example.msvc_ventas.domain.model.DetalleVenta;
import com.example.msvc_ventas.domain.model.Venta;
import com.example.msvc_ventas.domain.repository.DetalleVentaRepository;
import com.example.msvc_ventas.domain.repository.VentaRepository;
import com.example.msvc_ventas.domain.service.ClienteService;
import com.example.msvc_ventas.domain.service.VentaService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final ClienteService clienteService;
    @Qualifier("com.example.msvc_ventas.application.client.ProductoClient")
    private final ProductoClient productoClient;
    @Qualifier("com.example.msvc_ventas.application.client.InventarioClient")
    private final InventarioClient inventarioClient;

    @Override
    @Transactional
    public Venta crearVenta(Venta venta) {
        // Verificar que el cliente existe
        Cliente cliente = clienteService.obtenerClientePorId(venta.getCliente().getId());
        venta.setCliente(cliente);

        //  Validar que hay suficiente inventario para cada producto
        for (DetalleVenta detalle : venta.getDetalles()) {
            try {
                // Obtener información del producto (para tener nombre, precio, etc.)
                ProductoDto producto = productoClient.obtenerProducto(detalle.getProductoId());

                // Obtener inventario directamente del microservicio de inventario
                InventarioInfoDto inventario = inventarioClient.obtenerInventarioPorProductoId(detalle.getProductoId());

                // Verificar si hay suficiente inventario
                if (inventario == null || inventario.getCantidad() < detalle.getCantidad()) {
                    int cantidadDisponible = (inventario != null) ? inventario.getCantidad() : 0;
                    throw new IllegalStateException(
                            "No hay suficiente inventario para el producto " + producto.getNombre() +
                                    ". Disponible: " + cantidadDisponible + ", Solicitado: " + detalle.getCantidad()
                    );
                }
            } catch (FeignException e) {
                // Si es 404, significa que no existe inventario para este producto
                if (e.status() == 404) {
                    throw new IllegalStateException("No existe inventario para el producto con ID: " +
                            detalle.getProductoId());
                }
                throw new RuntimeException("Error al verificar el inventario del producto con ID: " +
                        detalle.getProductoId(), e);
            }
        }

        // Establecer fechas y estado inicial
        LocalDateTime ahora = LocalDateTime.now();
        venta.setFechaVenta(ahora);
        venta.setFechaCreacion(ahora);
        venta.setFechaActualizacion(ahora);
        venta.setEstado(Venta.EstadoVenta.PENDIENTE);

        // Guardar la venta para obtener el ID
        Venta ventaGuardada = ventaRepository.save(venta);

        // Procesar cada detalle de la venta
        List<DetalleVenta> detallesActualizados = new ArrayList<>();
        for (DetalleVenta detalle : venta.getDetalles()) {
            detalle.setVentaId(ventaGuardada.getId());
            DetalleVenta detalleGuardado = detalleVentaRepository.save(detalle);
            detallesActualizados.add(detalleGuardado);
        }

        ventaGuardada.setDetalles(detallesActualizados);
        return ventaGuardada;
    }

    @Override
    @Transactional
    public Venta actualizarVenta(Long id, Venta venta) {
        Venta ventaExistente = obtenerVentaPorId(id);

        // Solo permitir actualizar ventas pendientes
        if (ventaExistente.getEstado() != Venta.EstadoVenta.PENDIENTE) {
            throw new IllegalStateException("No se puede actualizar una venta que no está en estado PENDIENTE");
        }

        // Actualizar campos básicos
        ventaExistente.setFechaActualizacion(LocalDateTime.now());

        return ventaRepository.save(ventaExistente);
    }

    @Override
    @Transactional(readOnly = true)
    public Venta obtenerVentaPorId(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Venta no encontrada con ID: " + id));

        // Cargar los detalles de la venta
        List<DetalleVenta> detalles = detalleVentaRepository.findByVentaId(venta.getId());
        venta.setDetalles(detalles);

        return venta;
    }

    @Override
    @Transactional(readOnly = true)
    public Venta obtenerVentaPorNumeroFactura(String numeroFactura) {
        Venta venta = ventaRepository.findByNumeroFactura(numeroFactura)
                .orElseThrow(() -> new NoSuchElementException("Venta no encontrada con número de factura: " + numeroFactura));

        // Cargar los detalles de la venta
        List<DetalleVenta> detalles = detalleVentaRepository.findByVentaId(venta.getId());
        venta.setDetalles(detalles);

        return venta;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> listarVentasPorCliente(Long clienteId) {
        // Verificar que el cliente existe
        clienteService.obtenerClientePorId(clienteId);

        List<Venta> ventas = ventaRepository.findByClienteId(clienteId);

        // Cargar los detalles de cada venta
        for (Venta venta : ventas) {
            List<DetalleVenta> detalles = detalleVentaRepository.findByVentaId(venta.getId());
            venta.setDetalles(detalles);
        }

        return ventas;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> listarVentas() {
        List<Venta> ventas = ventaRepository.findAll();

        // Cargar los detalles de cada venta
        for (Venta venta : ventas) {
            List<DetalleVenta> detalles = detalleVentaRepository.findByVentaId(venta.getId());
            venta.setDetalles(detalles);
        }

        return ventas;
    }

    @Override
    @Transactional
    public Venta completarVenta(Long id) {
        Venta venta = obtenerVentaPorId(id);

        // Verificar que la venta está en estado pendiente
        if (venta.getEstado() != Venta.EstadoVenta.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden completar ventas en estado PENDIENTE");
        }

        // Obtener los detalles directamente del repositorio para evitar el error
        List<DetalleVenta> detalles = detalleVentaRepository.findByVentaId(id);
        if (detalles == null || detalles.isEmpty()) {
            throw new IllegalStateException("La venta no tiene detalles asociados, no se puede completar");
        }

        // Actualizar el inventario (restar stock)
        try {
            // Preparar los items para la salida de inventario usando los detalles obtenidos directamente
            List<SalidaInventarioLoteRequestDto.SalidaInventarioItemDto> items = detalles.stream()
                    .map(detalle -> {
                        SalidaInventarioLoteRequestDto.SalidaInventarioItemDto item = new SalidaInventarioLoteRequestDto.SalidaInventarioItemDto();
                        item.setProductoId(detalle.getProductoId());
                        item.setCantidad(detalle.getCantidad());
                        return item;
                    })
                    .collect(Collectors.toList());

            // Crear el DTO para la salida de inventario
            SalidaInventarioLoteRequestDto salidaDto = new SalidaInventarioLoteRequestDto();
            salidaDto.setItems(items);
            salidaDto.setMotivo("Venta #" + venta.getNumeroFactura());

            // Llamar al microservicio de inventario
            inventarioClient.procesarSalidaLote(salidaDto);
        } catch (FeignException e) {
            throw new RuntimeException("Error al actualizar el inventario: " + e.getMessage(), e);
        }

        // Actualizar el estado de la venta
        venta.setEstado(Venta.EstadoVenta.COMPLETADA);
        venta.setFechaActualizacion(LocalDateTime.now());

        return ventaRepository.save(venta);
    }

    @Override
    @Transactional
    public Venta cancelarVenta(Long id) {
        Venta venta = obtenerVentaPorId(id);

        // Solo se pueden cancelar ventas pendientes
        if (venta.getEstado() != Venta.EstadoVenta.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden cancelar ventas en estado PENDIENTE");
        }

        // Actualizar el estado de la venta
        venta.setEstado(Venta.EstadoVenta.CANCELADA);
        venta.setFechaActualizacion(LocalDateTime.now());

        return ventaRepository.save(venta);
    }
}