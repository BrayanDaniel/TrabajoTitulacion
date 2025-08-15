'use client';

import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import authService from '../../../services/authService';

interface RegistroModalProps {
    visible: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

export default function RegistroModal({ visible, onHide, onSuccess }: RegistroModalProps) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        nombre: '',
        apellido: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(''); // Limpiar errores al escribir
    };

    const validateForm = () => {
        if (!formData.username.trim()) return 'El nombre de usuario es requerido';
        if (formData.username.length < 4) return 'El nombre de usuario debe tener al menos 4 caracteres';
        if (!formData.password) return 'La contraseña es requerida';
        if (formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        if (formData.password !== formData.confirmPassword) return 'Las contraseñas no coinciden';
        if (!formData.email.trim()) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email inválido';
        if (!formData.nombre.trim()) return 'El nombre es requerido';
        if (!formData.apellido.trim()) return 'El apellido es requerido';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Preparar datos para el registro (ROL_USER por defecto)
            const registroData = {
                username: formData.username.trim(),
                password: formData.password,
                email: formData.email.trim().toLowerCase(),
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim()
                // No enviamos roles - el backend asigna ROLE_USER por defecto
            };

            console.log('📝 Registrando usuario:', registroData);
            const response = await authService.register(registroData);

            console.log('📋 Respuesta del servidor:', response);

            // ✅ CORREGIDO: Detectar éxito basado en la estructura real de respuesta
            const isSuccess = 
                // Si tiene ID, significa que se creó exitosamente
                (response && response.id && response.username) ||
                // O si la respuesta directa indica éxito
                response?.success === true ||
                // O si el mensaje indica éxito
                (response?.message && (
                    response.message.includes('exitoso') ||
                    response.message.includes('registrado') ||
                    response.message.includes('creado')
                )) ||
                // O si el status es exitoso
                response?.status === 200 ||
                response?.status === 201;

            if (isSuccess) {
                setSuccess('¡Cuenta creada exitosamente! 🎉 Ya puedes iniciar sesión con tus credenciales.');
                
                // ✅ CORREGIDO: Dar más tiempo para leer el mensaje
                setTimeout(() => {
                    resetForm();
                    onSuccess();
                    onHide();
                }, 4500); // 4.5 segundos para leer bien el mensaje
                
            } else {
                // Manejar errores específicos
                let errorMsg = 'Error al crear la cuenta. Intenta nuevamente.';
                
                if (response?.message) {
                    if (response.message.includes('username') || response.message.includes('usuario')) {
                        errorMsg = 'Este nombre de usuario ya está en uso. Prueba con otro.';
                    } else if (response.message.includes('email') || response.message.includes('correo')) {
                        errorMsg = 'Este email ya está registrado. Usa otro correo o inicia sesión.';
                    } else {
                        errorMsg = response.message;
                    }
                } else if (response && typeof response === 'string') {
                    // Si la respuesta es un string de error
                    errorMsg = response;
                }
                
                setError(errorMsg);
            }
        } catch (error: any) {
            console.error('💥 Error en registro:', error);
            
            // ✅ MEJORADO: Detectar errores específicos del servidor
            if (error?.response?.status === 409) {
                setError('El usuario o email ya existe. Intenta con datos diferentes.');
            } else if (error?.response?.status === 400) {
                setError('Datos inválidos. Verifica que toda la información sea correcta.');
            } else if (error?.message?.includes('fetch')) {
                setError('Error de conexión con el servidor. Verifica tu internet e intenta nuevamente.');
            } else {
                setError('Error inesperado. Intenta nuevamente en unos segundos.');
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            nombre: '',
            apellido: ''
        });
        setError('');
        setSuccess('');
    };

    const headerElement = (
        <div className="flex align-items-center gap-2">
            <i className="pi pi-user-plus text-primary text-2xl"></i>
            <span className="font-bold text-xl">Crear Cuenta</span>
        </div>
    );

    const footerContent = (
        <div className="flex justify-content-between align-items-center pt-4 px-4 pb-2">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={() => {
                    onHide();
                    resetForm();
                }}
                className="p-button-text p-button-secondary"
                disabled={loading}
                style={{ 
                    borderRadius: '25px',
                    padding: '10px 20px',
                    fontWeight: '600'
                }}
            />
            <Button
                label={loading ? "Creando cuenta..." : "Crear Cuenta"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-user-plus"}
                onClick={handleSubmit}
                disabled={loading}
                style={{ 
                    background: loading ? 'var(--surface-300)' : 'linear-gradient(135deg, var(--primary-color) 0%, var(--pink-500) 100%)',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '10px 25px',
                    fontWeight: '600',
                    minWidth: '150px'
                }}
            />
        </div>
    );

    return (
        <Dialog
            header={headerElement}
            visible={visible}
            onHide={() => {
                onHide();
                resetForm();
            }}
            footer={footerContent}
            style={{ width: '95vw', maxWidth: '650px' }}
            modal
            className="p-fluid registro-modal"
            closable={!loading}
            breakpoints={{ '960px': '90vw', '641px': '95vw' }}
        >
            <form onSubmit={handleSubmit} className="flex flex-column gap-4 p-4">
                
                {/* Mensajes mejorados */}
                {error && (
                    <Message 
                        severity="error" 
                        text={error} 
                        className="mb-3 animate__animated animate__fadeIn"
                        style={{ 
                            borderRadius: '10px', 
                            padding: '15px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    />
                )}
                {success && (
                    <Message 
                        severity="success" 
                        text={success} 
                        className="mb-3 animate__animated animate__bounceIn"
                        style={{ 
                            borderRadius: '10px', 
                            padding: '15px',
                            fontSize: '14px',
                            fontWeight: '600',
                            backgroundColor: '#22c55e',
                            border: '2px solid #16a34a',
                            color: 'white'
                        }}
                    />
                )}

                {/* Información Personal - Lado a lado */}
                <div className="grid formgrid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="nombre" className="block text-900 font-semibold mb-2" style={{ fontSize: '14px' }}>
                            <i className="pi pi-user mr-2" style={{ color: 'var(--primary-color)' }}></i>
                            Nombre *
                        </label>
                        <InputText
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => handleChange('nombre', e.target.value)}
                            placeholder="Ingresa tu nombre"
                            disabled={loading}
                            className="w-full input-custom"
                            style={{ 
                                borderRadius: '8px',
                                padding: '12px',
                                border: '2px solid var(--surface-border)',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="apellido" className="block text-900 font-semibold mb-2" style={{ fontSize: '14px' }}>
                            <i className="pi pi-user mr-2" style={{ color: 'var(--primary-color)' }}></i>
                            Apellido *
                        </label>
                        <InputText
                            id="apellido"
                            value={formData.apellido}
                            onChange={(e) => handleChange('apellido', e.target.value)}
                            placeholder="Ingresa tu apellido"
                            disabled={loading}
                            className="w-full input-custom"
                            style={{ 
                                borderRadius: '8px',
                                padding: '12px',
                                border: '2px solid var(--surface-border)',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="field">
                    <label htmlFor="email" className="block text-900 font-semibold mb-2" style={{ fontSize: '14px' }}>
                        <i className="pi pi-envelope mr-2" style={{ color: 'var(--primary-color)' }}></i>
                        Correo Electrónico *
                    </label>
                    <InputText
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="ejemplo@correo.com"
                        disabled={loading}
                        className="w-full input-custom"
                        style={{ 
                            borderRadius: '8px',
                            padding: '12px',
                            border: '2px solid var(--surface-border)',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <Divider style={{ margin: '20px 0' }} />

                {/* Credenciales */}
                <div className="field">
                    <label htmlFor="username" className="block text-900 font-semibold mb-2" style={{ fontSize: '14px' }}>
                        <i className="pi pi-at mr-2" style={{ color: 'var(--primary-color)' }}></i>
                        Nombre de Usuario *
                    </label>
                    <InputText
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        placeholder="Mínimo 4 caracteres (sin espacios)"
                        disabled={loading}
                        className="w-full input-custom"
                        style={{ 
                            borderRadius: '8px',
                            padding: '12px',
                            border: '2px solid var(--surface-border)',
                            fontSize: '14px'
                        }}
                    />
                </div>

                {/* Contraseñas - Lado a lado */}
                <div className="grid formgrid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="password" className="block text-900 font-semibold mb-2" style={{ fontSize: '14px' }}>
                            <i className="pi pi-lock mr-2" style={{ color: 'var(--primary-color)' }}></i>
                            Contraseña *
                        </label>
                        <Password
                            id="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            disabled={loading}
                            className="w-full"
                            toggleMask
                            feedback={false}
                            inputStyle={{ 
                                borderRadius: '8px',
                                padding: '12px',
                                border: '2px solid var(--surface-border)',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="confirmPassword" className="block text-900 font-semibold mb-2" style={{ fontSize: '14px' }}>
                            <i className="pi pi-lock mr-2" style={{ color: 'var(--primary-color)' }}></i>
                            Confirmar Contraseña *
                        </label>
                        <Password
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            placeholder="Repite tu contraseña"
                            disabled={loading}
                            className="w-full"
                            toggleMask
                            feedback={false}
                            inputStyle={{ 
                                borderRadius: '8px',
                                padding: '12px',
                                border: '2px solid var(--surface-border)',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>

                {/* Información adicional */}
                <div className="field mt-3">
                    <div 
                        className="text-sm text-600 p-3 border-round flex align-items-center gap-2"
                        style={{ backgroundColor: 'var(--primary-color-text)', border: '1px solid var(--primary-color)' }}
                    >
                        <i className="pi pi-info-circle" style={{ color: 'var(--primary-color)' }}></i>
                        <span>Al registrarte tendrás acceso completo a la tienda como cliente.</span>
                    </div>
                </div>
            </form>
            
            {/* Estilos CSS personalizados */}
            <style jsx>{`
                .registro-modal .p-dialog-content {
                    padding: 0;
                    background: linear-gradient(135deg, var(--surface-card) 0%, var(--surface-50) 100%);
                }
                
                .registro-modal .p-dialog-header {
                    background: linear-gradient(135deg, var(--primary-color) 0%, var(--pink-500) 100%);
                    color: white;
                    border-radius: 12px 12px 0 0;
                    padding: 20px 25px;
                }
                
                .registro-modal .p-dialog-header .p-dialog-title {
                    color: white;
                    font-weight: bold;
                }
                
                .registro-modal .p-dialog-header-icon {
                    color: white;
                }
                
                .input-custom:focus {
                    border-color: var(--primary-color) !important;
                    box-shadow: 0 0 0 0.2rem var(--primary-color-text) !important;
                }
                
                .registro-modal .p-password input:focus {
                    border-color: var(--primary-color) !important;
                    box-shadow: 0 0 0 0.2rem var(--primary-color-text) !important;
                }
                
                .registro-modal .p-dialog-footer {
                    background: var(--surface-50);
                    border-radius: 0 0 12px 12px;
                    border-top: 1px solid var(--surface-border);
                }

                /* Animaciones para mensajes */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes bounceIn {
                    0% { opacity: 0; transform: scale(0.3); }
                    50% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }

                .animate__animated {
                    animation-duration: 0.6s;
                    animation-fill-mode: both;
                }

                .animate__fadeIn {
                    animation-name: fadeIn;
                }

                .animate__bounceIn {
                    animation-name: bounceIn;
                }
            `}</style>
        </Dialog>
    );
}