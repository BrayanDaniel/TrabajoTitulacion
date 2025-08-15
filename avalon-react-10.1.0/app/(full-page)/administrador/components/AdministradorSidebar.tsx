'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

export default function AdministradorSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            url: '/administrador',
            badge: null
        },
        {
            label: 'Usuarios',
            icon: 'pi pi-users',
            url: '/administrador/usuarios',
            badge: null
        },
        {
            label: 'Productos',
            icon: 'pi pi-box',
            url: '/administrador/productos',
            badge: null
        },
        {
            label: 'Categorías',
            icon: 'pi pi-tags',
            url: '/administrador/categorias',
            badge: null
        },
        {
            label: 'Empresas',
            icon: 'pi pi-building',
            url: '/administrador/empresas',
            badge: null
        },
        {
            label: 'Inventario',
            icon: 'pi pi-database',
            url: '/administrador/inventario',
            badge: null
        },
        {
            label: 'Ventas',
            icon: 'pi pi-shopping-cart',
            url: '/administrador/ventas',
            badge: null
        }
    ];

    const isActive = (url: string) => {
        if (url === '/administrador') {
            return pathname === url;
        }
        return pathname.startsWith(url);
    };

    const handleNavigation = (url: string) => {
        router.push(url);
    };

    return (
        <div 
            className="layout-sidebar-content h-full flex flex-column"
            style={{ backgroundColor: 'var(--surface-card)' }}
        >
            {/* Header del sidebar */}
            <div 
                className="sidebar-header p-4 border-bottom-1 surface-border"
                style={{ borderColor: 'var(--surface-border)' }}
            >
                <div 
                    className="flex align-items-center cursor-pointer"
                    onClick={() => router.push('/administrador')}
                >
                    <div 
                        className="w-3rem h-3rem border-circle flex align-items-center justify-content-center mr-3"
                        style={{ 
                            backgroundColor: 'var(--red-500)',
                            color: 'white'
                        }}
                    >
                        <i className="pi pi-shield text-xl"></i>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-900">Panel Admin</div>
                        <div className="text-sm text-600">Administrador</div>
                    </div>
                </div>
            </div>

            {/* Navegación principal - TODO INTEGRADO */}
            <div className="sidebar-menu flex-1 p-3">
                <ul className="list-none p-0 m-0">
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-1">
                            <Button
                                className={`w-full text-left p-3 border-round-lg border-none ${
                                    isActive(item.url) 
                                        ? 'bg-primary text-white' 
                                        : 'surface-hover text-color hover:bg-primary-50 hover:text-primary'
                                }`}
                                style={{
                                    justifyContent: 'flex-start',
                                    backgroundColor: isActive(item.url) 
                                        ? 'var(--red-500)' 
                                        : 'transparent',
                                    color: isActive(item.url) 
                                        ? 'white' 
                                        : 'var(--text-color)',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleNavigation(item.url)}
                                onMouseEnter={(e) => {
                                    if (!isActive(item.url)) {
                                        e.currentTarget.style.backgroundColor = 'var(--red-50)';
                                        e.currentTarget.style.color = 'var(--red-500)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive(item.url)) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-color)';
                                    }
                                }}
                            >
                                <div className="flex align-items-center justify-content-between w-full">
                                    <div className="flex align-items-center">
                                        <i className={`${item.icon} mr-3 text-lg`}></i>
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <Badge 
                                            value={item.badge} 
                                            severity={isActive(item.url) ? 'info' : 'success'}
                                            style={{
                                                backgroundColor: isActive(item.url) 
                                                    ? 'rgba(255,255,255,0.3)' 
                                                    : 'var(--green-500)'
                                            }}
                                        />
                                    )}
                                </div>
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer del sidebar */}
            <div 
                className="sidebar-footer p-3 border-top-1 surface-border"
                style={{ borderColor: 'var(--surface-border)' }}
            >
                <div 
                    className="p-3 border-round-lg text-center"
                    style={{ 
                        backgroundColor: 'var(--red-50)',
                        border: `1px solid var(--red-200)`
                    }}
                >
                    <i 
                        className="pi pi-shield text-2xl mb-2"
                        style={{ color: 'var(--red-500)' }}
                    ></i>
                    <div 
                        className="font-bold mb-1"
                        style={{ color: 'var(--red-500)' }}
                    >
                        Administrador
                    </div>
                    <div className="text-sm text-600 line-height-3">
                        Gestiona usuarios y supervisa el sistema completo.
                    </div>
                </div>
            </div>
        </div>
    );
}