package com.example.msvc_ventas.domain.service;

import com.example.msvc_ventas.domain.model.Cliente;

import java.util.List;

public interface ClienteService {
    Cliente crearCliente(Cliente cliente);
    Cliente actualizarCliente(Long id, Cliente cliente);
    Cliente obtenerClientePorId(Long id);
    Cliente obtenerClientePorEmail(String email);
    List<Cliente> listarClientes();
    void eliminarCliente(Long id);
}