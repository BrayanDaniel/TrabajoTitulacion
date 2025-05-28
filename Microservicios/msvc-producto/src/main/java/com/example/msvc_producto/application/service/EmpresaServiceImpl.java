package com.example.msvc_producto.application.service;

import com.example.msvc_producto.domain.model.Empresa;
import com.example.msvc_producto.domain.repository.EmpresaRepository;
import com.example.msvc_producto.domain.service.EmpresaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmpresaServiceImpl implements EmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaServiceImpl(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @Override
    @Transactional
    public Empresa crearEmpresa(Empresa empresa) {
        empresa.setFechaCreacion(LocalDateTime.now());
        empresa.setFechaActualizacion(LocalDateTime.now());
        empresa.setActivo(true);
        return empresaRepository.save(empresa);
    }

    @Override
    @Transactional
    public Empresa actualizarEmpresa(Long id, Empresa empresa) {
        Empresa empresaExistente = obtenerEmpresaPorId(id);

        empresaExistente.setNombre(empresa.getNombre());
        empresaExistente.setRuc(empresa.getRuc());
        empresaExistente.setDireccion(empresa.getDireccion());
        empresaExistente.setTelefono(empresa.getTelefono());
        empresaExistente.setEmail(empresa.getEmail());
        empresaExistente.setActivo(empresa.getActivo());
        empresaExistente.setFechaActualizacion(LocalDateTime.now());

        return empresaRepository.save(empresaExistente);
    }

    @Override
    @Transactional(readOnly = true)
    public Empresa obtenerEmpresaPorId(Long id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Empresa no encontrada con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Empresa> listarEmpresas() {
        return empresaRepository.findAll();
    }

    @Override
    @Transactional
    public void eliminarEmpresa(Long id) {
        Empresa empresa = obtenerEmpresaPorId(id);
        empresa.setActivo(false);
        empresa.setFechaActualizacion(LocalDateTime.now());
        empresaRepository.save(empresa);
    }
}