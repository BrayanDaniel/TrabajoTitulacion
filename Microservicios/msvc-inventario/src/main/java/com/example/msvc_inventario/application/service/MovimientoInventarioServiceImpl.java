package com.example.msvc_inventario.application.service;

import com.example.msvc_inventario.domain.model.MovimientoInventario;
import com.example.msvc_inventario.domain.repository.MovimientoInventarioRepository;
import com.example.msvc_inventario.domain.service.MovimientoInventarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MovimientoInventarioServiceImpl implements MovimientoInventarioService {

    private final MovimientoInventarioRepository movimientoRepository;

    public MovimientoInventarioServiceImpl(MovimientoInventarioRepository movimientoRepository) {
        this.movimientoRepository = movimientoRepository;
    }

    @Override
    @Transactional
    public MovimientoInventario registrarMovimiento(MovimientoInventario movimiento) {
        movimiento.setFechaMovimiento(LocalDateTime.now());
        return movimientoRepository.save(movimiento);
    }

    @Override
    public MovimientoInventario obtenerPorId(Long id) {
        return movimientoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Movimiento no encontrado con ID: " + id));
    }

    @Override
    public List<MovimientoInventario> listarPorInventarioId(Long inventarioId) {
        return movimientoRepository.findByInventarioId(inventarioId);
    }

    @Override
    public List<MovimientoInventario> listarTodos() {
        return movimientoRepository.findAll();
    }
}