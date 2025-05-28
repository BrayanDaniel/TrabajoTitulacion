package com.example.msvc_ventas.application.mapper;

import com.example.msvc_ventas.application.dto.*;
import com.example.msvc_ventas.domain.model.Cliente;
import com.example.msvc_ventas.domain.model.DetalleVenta;
import com.example.msvc_ventas.domain.model.Venta;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class VentaMapper {

    private final ClienteMapper clienteMapper;

    public VentaMapper(ClienteMapper clienteMapper) {
        this.clienteMapper = clienteMapper;
    }

    public Venta toEntity(VentaRequestDto dto, Cliente cliente, List<ProductoDto> productos) {
        // Crear los detalles de venta basados en los items y productos
        List<DetalleVenta> detalles = dto.getItems().stream()
                .map(item -> {
                    // Buscar el producto correspondiente
                    ProductoDto producto = productos.stream()
                            .filter(p -> p.getId().equals(item.getProductoId()))
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + item.getProductoId()));

                    // Calcular el subtotal
                    BigDecimal subtotal = producto.getPrecio().multiply(new BigDecimal(item.getCantidad()));

                    // Crear el detalle
                    return DetalleVenta.builder()
                            .productoId(item.getProductoId())
                            .nombreProducto(producto.getNombre())
                            .cantidad(item.getCantidad())
                            .precioUnitario(producto.getPrecio())
                            .subtotal(subtotal)
                            .build();
                })
                .collect(Collectors.toList());

        // Calcular los totales
        BigDecimal subtotal = detalles.stream()
                .map(DetalleVenta::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Aplicar impuesto (15%)
        BigDecimal impuesto = subtotal.multiply(new BigDecimal("0.15"));
        BigDecimal total = subtotal.add(impuesto);

        // Generar número de factura único (formato simple para ejemplo)
        String numeroFactura = "FACT-" + System.currentTimeMillis();

        // Crear la venta
        return Venta.builder()
                .numeroFactura(numeroFactura)
                .cliente(cliente)
                .subtotal(subtotal)
                .impuesto(impuesto)
                .total(total)
                .estado(Venta.EstadoVenta.PENDIENTE)
                .fechaVenta(LocalDateTime.now())
                .detalles(detalles)
                .build();
    }

    public VentaResponseDto toDto(Venta venta) {
        // Mapear los detalles
        List<DetalleVentaResponseDto> detallesDtos = venta.getDetalles().stream()
                .map(detalle -> DetalleVentaResponseDto.builder()
                        .id(detalle.getId())
                        .productoId(detalle.getProductoId())
                        .nombreProducto(detalle.getNombreProducto())
                        .cantidad(detalle.getCantidad())
                        .precioUnitario(detalle.getPrecioUnitario())
                        .subtotal(detalle.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        // Mapear la venta
        return VentaResponseDto.builder()
                .id(venta.getId())
                .numeroFactura(venta.getNumeroFactura())
                .cliente(clienteMapper.toDto(venta.getCliente()))
                .subtotal(venta.getSubtotal())
                .impuesto(venta.getImpuesto())
                .total(venta.getTotal())
                .estado(venta.getEstado().name())
                .fechaVenta(venta.getFechaVenta())
                .fechaCreacion(venta.getFechaCreacion())
                .fechaActualizacion(venta.getFechaActualizacion())
                .detalles(detallesDtos)
                .build();
    }
}