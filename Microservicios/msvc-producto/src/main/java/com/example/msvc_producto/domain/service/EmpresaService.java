package com.example.msvc_producto.domain.service;

import com.example.msvc_producto.domain.model.Empresa;

import java.util.List;

public interface EmpresaService {
    Empresa crearEmpresa(Empresa empresa);
    Empresa actualizarEmpresa(Long id, Empresa empresa);
    Empresa obtenerEmpresaPorId(Long id);
    List<Empresa> listarEmpresas();
    void eliminarEmpresa(Long id);
}