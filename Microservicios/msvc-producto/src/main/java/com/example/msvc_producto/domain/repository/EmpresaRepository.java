package com.example.msvc_producto.domain.repository;

import com.example.msvc_producto.domain.model.Empresa;

import java.util.List;
import java.util.Optional;

public interface EmpresaRepository {
    Empresa save(Empresa empresa);
    Optional<Empresa> findById(Long id);
    List<Empresa> findAll();
    void deleteById(Long id);
}