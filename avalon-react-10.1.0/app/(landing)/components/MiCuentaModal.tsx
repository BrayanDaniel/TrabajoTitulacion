'use client';

import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';

interface MiCuentaModalProps {
    visible: boolean;
    onHide: () => void;
    userInfo: any;
}

export default function MiCuentaModal({ visible, onHide, userInfo }: MiCuentaModalProps) {
    
    const getRolDisplay = (rol: string) => {
        switch (rol) {
            case 'ROLE_ADMIN':
                return { label: 'Administrador', severity: 'danger', icon: 'pi-shield' };
            case 'ROLE_EMP':
                return { label: 'Emprendedor', severity: 'warning', icon: 'pi-briefcase' };
            case 'ROLE_USER':
            default:
                return { label: 'Cliente', severity: 'info', icon: 'pi-user' };
        }
    };

    const rolInfo = getRolDisplay(userInfo?.rol);

    const headerElement = (
        <div className="flex align-items-center gap-3">
            <div 
                className="flex align-items-center justify-content-center w-3rem h-3rem border-circle text-white"
                style={{ backgroundColor: 'var(--primary-color)' }}
            >
                <i className={`pi ${rolInfo.icon} text-xl`}></i>
            </div>
            <div>
                <div className="text-xl font-bold text-white">Mi Cuenta</div>
                <div className="text-sm opacity-90">Información de perfil</div>
            </div>
        </div>
    );

    const footerContent = (
        <div className="flex justify-content-end align-items-center pt-3">
            <Button
                label="Cerrar"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-outlined"
                style={{ 
                    borderColor: 'var(--primary-color)',
                    color: 'var(--primary-color)',
                    borderRadius: '25px',
                    fontWeight: '600',
                    padding: '8px 20px'
                }}
            />
        </div>
    );

    if (!userInfo) {
        return null;
    }

    return (
        <Dialog
            header={headerElement}
            visible={visible}
            onHide={onHide}
            footer={footerContent}
            style={{ width: '95vw', maxWidth: '500px' }}
            modal
            className="mi-cuenta-modal"
            closable={true}
            breakpoints={{ '960px': '90vw', '641px': '95vw' }}
        >
            <div className="p-4">
                
                {/* Avatar y nombre principal */}
                <div className="text-center mb-4">
                    <div 
                        className="inline-flex align-items-center justify-content-center w-5rem h-5rem border-circle text-white text-2xl font-bold mb-3"
                        style={{ 
                            background: `linear-gradient(135deg, var(--primary-color) 0%, var(--pink-500) 100%)`,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        {(userInfo.nombre?.[0] || userInfo.username?.[0] || 'U').toUpperCase()}
                    </div>
                    <div className="text-2xl font-bold text-900 mb-1">
                        {userInfo.nombre} {userInfo.apellido}
                    </div>
                    <div className="text-600 mb-3">@{userInfo.username}</div>
                    
                    {/* Badge del rol */}
                    <Chip 
                        label={rolInfo.label}
                        icon={`pi ${rolInfo.icon}`}
                        className="custom-chip"
                        style={{
                            backgroundColor: rolInfo.severity === 'danger' ? '#ef4444' : 
                                           rolInfo.severity === 'warning' ? '#f59e0b' : '#3b82f6',
                            color: 'white',
                            fontWeight: '600',
                            padding: '8px 16px',
                            borderRadius: '20px'
                        }}
                    />
                </div>

                <Divider style={{ margin: '20px 0' }} />

                {/* Información de contacto */}
                <div className="grid formgrid">
                    
                    {/* Email */}
                    <div className="field col-12">
                        <div className="flex align-items-center gap-3 p-3 border-round-lg" style={{ backgroundColor: 'var(--surface-100)' }}>
                            <div 
                                className="flex align-items-center justify-content-center w-2rem h-2rem border-circle"
                                style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                            >
                                <i className="pi pi-envelope text-sm"></i>
                            </div>
                            <div className="flex-1">
                                <div className="text-600 text-sm font-medium">Correo Electrónico</div>
                                <div className="text-900 font-semibold">{userInfo.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Username */}
                    <div className="field col-12 md:col-6">
                        <div className="flex align-items-center gap-3 p-3 border-round-lg" style={{ backgroundColor: 'var(--surface-100)' }}>
                            <div 
                                className="flex align-items-center justify-content-center w-2rem h-2rem border-circle"
                                style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                            >
                                <i className="pi pi-at text-sm"></i>
                            </div>
                            <div className="flex-1">
                                <div className="text-600 text-sm font-medium">Usuario</div>
                                <div className="text-900 font-semibold">{userInfo.username}</div>
                            </div>
                        </div>
                    </div>

                    {/* ID de usuario */}
                    <div className="field col-12 md:col-6">
                        <div className="flex align-items-center gap-3 p-3 border-round-lg" style={{ backgroundColor: 'var(--surface-100)' }}>
                            <div 
                                className="flex align-items-center justify-content-center w-2rem h-2rem border-circle"
                                style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                            >
                                <i className="pi pi-id-card text-sm"></i>
                            </div>
                            <div className="flex-1">
                                <div className="text-600 text-sm font-medium">ID Usuario</div>
                                <div className="text-900 font-semibold">#{userInfo.id || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="mt-4">
                    <div 
                        className="text-sm text-600 p-3 border-round flex align-items-center gap-2"
                        style={{ backgroundColor: 'var(--primary-color-text)', border: '1px solid var(--primary-color)' }}
                    >
                        <i className="pi pi-info-circle" style={{ color: 'var(--primary-color)' }}></i>
                        <div>
                            <div className="font-medium">Cuenta creada exitosamente</div>
                            <div className="text-xs mt-1">Tienes acceso completo a todas las funciones de la tienda.</div>
                        </div>
                    </div>
                </div>

                {/* Funciones disponibles */}
                <div className="mt-4">
                    <div className="text-900 font-semibold mb-3">¿Qué puedes hacer?</div>
                    <div className="grid">
                        <div className="col-6">
                            <div className="flex align-items-center gap-2 mb-2">
                                <i className="pi pi-shopping-cart text-primary"></i>
                                <span className="text-sm">Realizar compras</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="flex align-items-center gap-2 mb-2">
                                <i className="pi pi-heart text-primary"></i>
                                <span className="text-sm">Guardar favoritos</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="flex align-items-center gap-2 mb-2">
                                <i className="pi pi-history text-primary"></i>
                                <span className="text-sm">Ver historial</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="flex align-items-center gap-2 mb-2">
                                <i className="pi pi-star text-primary"></i>
                                <span className="text-sm">Calificar productos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos CSS personalizados */}
            <style jsx>{`
                .mi-cuenta-modal .p-dialog-content {
                    padding: 0;
                    background: linear-gradient(135deg, var(--surface-card) 0%, var(--surface-50) 100%);
                }
                
                .mi-cuenta-modal .p-dialog-header {
                    background: linear-gradient(135deg, var(--primary-color) 0%, var(--pink-500) 100%);
                    color: white;
                    border-radius: 12px 12px 0 0;
                    padding: 20px 25px;
                }
                
                .mi-cuenta-modal .p-dialog-header .p-dialog-title {
                    color: white;
                    font-weight: bold;
                }
                
                .mi-cuenta-modal .p-dialog-header-icon {
                    color: white;
                }
                
                .mi-cuenta-modal .p-dialog-footer {
                    background: var(--surface-50);
                    border-radius: 0 0 12px 12px;
                    border-top: 1px solid var(--surface-border);
                }

                .custom-chip {
                    font-size: 14px;
                    font-weight: 600;
                }
            `}</style>
        </Dialog>
    );
}