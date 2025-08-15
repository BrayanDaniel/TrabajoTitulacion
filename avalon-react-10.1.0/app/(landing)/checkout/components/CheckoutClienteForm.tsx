'use client';

import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import clientesService, { ClienteRequest } from '../../../../services/clientesService';

interface CheckoutClienteFormProps {
    onClienteData: (data: ClienteRequest) => void;
    onValidated: (isValid: boolean) => void;
}

const CheckoutClienteForm: React.FC<CheckoutClienteFormProps> = ({ onClienteData, onValidated }) => {
    const [formData, setFormData] = useState<ClienteRequest>({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        documento: ''
    });

    const [errors, setErrors] = useState<Partial<ClienteRequest>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof ClienteRequest, boolean>>>({});

    const primaryColor = 'var(--primary-color)';

    useEffect(() => {
        // Cargar datos guardados si existen
        const savedData = clientesService.obtenerDatosClienteLocal();
        if (savedData) {
            setFormData(savedData);
        }
    }, []);

    useEffect(() => {
        // Validar formulario cuando cambian los datos
        validateForm();
    }, [formData]);

    const validateForm = () => {
        const newErrors: Partial<ClienteRequest> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        }

        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es requerida';
        }

        // Validación del documento (cédula ecuatoriana)
        if (!formData.documento?.trim()) {
            newErrors.documento = 'La cédula es requerida';
        } else if (formData.documento.length !== 10) {
            newErrors.documento = 'La cédula debe tener 10 dígitos';
        } else if (!isValidEcuadorianID(formData.documento)) {
            newErrors.documento = 'Número de cédula inválido';
        }

        setErrors(newErrors);
        
        const isValid = Object.keys(newErrors).length === 0;
        onValidated(isValid);
        
        if (isValid) {
            clientesService.guardarDatosClienteLocal(formData);
            onClienteData(formData);
        }
    };

    // Función para validar cédula ecuatoriana
    const isValidEcuadorianID = (cedula: string): boolean => {
        if (cedula.length !== 10) return false;
        
        const digits = cedula.split('').map(Number);
        const provinceCode = parseInt(cedula.substring(0, 2));
        
        // Verificar que el código de provincia sea válido (01-24)
        if (provinceCode < 1 || provinceCode > 24) return false;
        
        // Algoritmo de verificación de cédula ecuatoriana
        const checkDigit = digits[9];
        let sum = 0;
        
        for (let i = 0; i < 9; i++) {
            let value = digits[i];
            if (i % 2 === 0) {
                value *= 2;
                if (value > 9) value -= 9;
            }
            sum += value;
        }
        
        const expectedCheckDigit = sum % 10 === 0 ? 0 : 10 - (sum % 10);
        return checkDigit === expectedCheckDigit;
    };

    const handleChange = (field: keyof ClienteRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBlur = (field: keyof ClienteRequest) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const getFieldError = (field: keyof ClienteRequest) => {
        return touched[field] && errors[field] ? errors[field] : '';
    };

    const getValidCount = () => {
        return Object.keys(formData).filter(key => {
            const field = key as keyof ClienteRequest;
            return formData[field]?.trim() && !errors[field];
        }).length;
    };

    return (
        <div className="checkout-cliente-form">
            {/* Header con progreso */}
            <div className="flex align-items-center justify-content-between mb-4">
                <div className="flex align-items-center">
                    <i className="pi pi-user-edit mr-2" style={{ color: primaryColor }}></i>
                    <span className="font-medium text-900">Complete sus datos</span>
                </div>
                <div className="flex align-items-center gap-2">
                    <span className="text-sm text-600">Progreso:</span>
                    <div 
                        className="px-3 py-1 border-round text-white text-sm font-bold"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {getValidCount()}/6
                    </div>
                </div>
            </div>

            <Divider />
            
            {/* Información Personal */}
            <div className="mb-5">
                <h4 className="flex align-items-center mb-3 text-900">
                    <i className="pi pi-user mr-2" style={{ color: primaryColor }}></i>
                    Información Personal
                </h4>
                
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="field mb-4">
                            <label htmlFor="nombre" className="flex align-items-center mb-2 font-medium text-900">
                                <i className="pi pi-user mr-2 text-600"></i>
                                Nombre <span className="text-red-500 ml-1">*</span>
                            </label>
                            <InputText
                                id="nombre"
                                value={formData.nombre}
                                onChange={(e) => handleChange('nombre', e.target.value)}
                                onBlur={() => handleBlur('nombre')}
                                placeholder="Ingresa tu nombre"
                                className={`w-full ${getFieldError('nombre') ? 'p-invalid' : ''}`}
                            />
                            {getFieldError('nombre') && (
                                <small className="p-error flex align-items-center mt-1">
                                    <i className="pi pi-exclamation-triangle mr-1"></i>
                                    {getFieldError('nombre')}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field mb-4">
                            <label htmlFor="apellido" className="flex align-items-center mb-2 font-medium text-900">
                                <i className="pi pi-user mr-2 text-600"></i>
                                Apellido <span className="text-red-500 ml-1">*</span>
                            </label>
                            <InputText
                                id="apellido"
                                value={formData.apellido}
                                onChange={(e) => handleChange('apellido', e.target.value)}
                                onBlur={() => handleBlur('apellido')}
                                placeholder="Ingresa tu apellido"
                                className={`w-full ${getFieldError('apellido') ? 'p-invalid' : ''}`}
                            />
                            {getFieldError('apellido') && (
                                <small className="p-error flex align-items-center mt-1">
                                    <i className="pi pi-exclamation-triangle mr-1"></i>
                                    {getFieldError('apellido')}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field mb-4">
                            <label htmlFor="documento" className="flex align-items-center mb-2 font-medium text-900">
                                <i className="pi pi-id-card mr-2 text-600"></i>
                                Cédula <span className="text-red-500 ml-1">*</span>
                            </label>
                            <InputMask
                                id="documento"
                                mask="9999999999"
                                value={formData.documento || ''}
                                onChange={(e) => handleChange('documento', e.value || '')}
                                onBlur={() => handleBlur('documento')}
                                placeholder="1234567890"
                                className={`w-full ${getFieldError('documento') ? 'p-invalid' : ''}`}
                            />
                            {getFieldError('documento') && (
                                <small className="p-error flex align-items-center mt-1">
                                    <i className="pi pi-exclamation-triangle mr-1"></i>
                                    {getFieldError('documento')}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field mb-4">
                            <label htmlFor="telefono" className="flex align-items-center mb-2 font-medium text-900">
                                <i className="pi pi-phone mr-2 text-600"></i>
                                Teléfono <span className="text-red-500 ml-1">*</span>
                            </label>
                            <InputMask
                                id="telefono"
                                mask="9999999999"
                                value={formData.telefono}
                                onChange={(e) => handleChange('telefono', e.value || '')}
                                onBlur={() => handleBlur('telefono')}
                                placeholder="0999999999"
                                className={`w-full ${getFieldError('telefono') ? 'p-invalid' : ''}`}
                            />
                            {getFieldError('telefono') && (
                                <small className="p-error flex align-items-center mt-1">
                                    <i className="pi pi-exclamation-triangle mr-1"></i>
                                    {getFieldError('telefono')}
                                </small>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Divider />

            {/* Información de Contacto */}
            <div className="mb-5">
                <h4 className="flex align-items-center mb-3 text-900">
                    <i className="pi pi-envelope mr-2" style={{ color: primaryColor }}></i>
                    Información de Contacto
                </h4>
                
                <div className="grid">
                    <div className="col-12">
                        <div className="field mb-4">
                            <label htmlFor="email" className="flex align-items-center mb-2 font-medium text-900">
                                <i className="pi pi-at mr-2 text-600"></i>
                                Email <span className="text-red-500 ml-1">*</span>
                            </label>
                            <InputText
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                placeholder="ejemplo@correo.com"
                                className={`w-full ${getFieldError('email') ? 'p-invalid' : ''}`}
                            />
                            {getFieldError('email') && (
                                <small className="p-error flex align-items-center mt-1">
                                    <i className="pi pi-exclamation-triangle mr-1"></i>
                                    {getFieldError('email')}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="field mb-4">
                            <label htmlFor="direccion" className="flex align-items-center mb-2 font-medium text-900">
                                <i className="pi pi-map-marker mr-2 text-600"></i>
                                Dirección de Envío <span className="text-red-500 ml-1">*</span>
                            </label>
                            <InputText
                                id="direccion"
                                value={formData.direccion}
                                onChange={(e) => handleChange('direccion', e.target.value)}
                                onBlur={() => handleBlur('direccion')}
                                placeholder="Calle, número, sector, ciudad..."
                                className={`w-full ${getFieldError('direccion') ? 'p-invalid' : ''}`}
                            />
                            {getFieldError('direccion') && (
                                <small className="p-error flex align-items-center mt-1">
                                    <i className="pi pi-exclamation-triangle mr-1"></i>
                                    {getFieldError('direccion')}
                                </small>
                            )}
                            <small className="text-600 mt-1 block">
                                <i className="pi pi-info-circle mr-1"></i>
                                Incluye detalles como sector, referencia o punto conocido
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mensaje informativo mejorado */}
            <div 
                className="p-4 border-round flex align-items-center"
                style={{ backgroundColor: `${primaryColor}08`, border: `1px solid ${primaryColor}30` }}
            >
                <i className="pi pi-shield mr-3 text-2xl" style={{ color: primaryColor }}></i>
                <div>
                    <div className="font-bold mb-1" style={{ color: primaryColor }}>
                        Datos Seguros
                    </div>
                    <div className="text-600 text-sm">
                        Tus datos serán guardados de forma segura y encriptada para futuras compras
                    </div>
                </div>
            </div>

            {/* Indicador de estado del formulario */}
            {Object.keys(errors).length === 0 && getValidCount() === 6 && (
                <div className="mt-3 p-3 border-round flex align-items-center" style={{ backgroundColor: '#10b98108', border: '1px solid #10b98130' }}>
                    <i className="pi pi-check-circle mr-2 text-green-500"></i>
                    <span className="text-green-700 font-medium">
                        ¡Formulario completado correctamente!
                    </span>
                </div>
            )}
        </div>
    );
};

export default CheckoutClienteForm;