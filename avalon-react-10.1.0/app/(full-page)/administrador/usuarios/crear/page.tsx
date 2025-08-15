'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import usuariosService, { CrearUsuarioRequest, ROLES_DISPONIBLES } from '@/services/usuariosService';

interface FormData {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    nombre: string;
    apellido: string;
    roles: string[];
}

interface FormErrors {
    username?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    nombre?: string;
    apellido?: string;
    roles?: string;
}

export default function CrearUsuarioPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        nombre: '',
        apellido: '',
        roles: []
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [validacionUsername, setValidacionUsername] = useState<string>('');
    const [validacionEmail, setValidacionEmail] = useState<string>('');
    const toast = React.useRef<Toast>(null);

    const mostrarExito = (mensaje: string) => {
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: mensaje });
    };

    const mostrarError = (mensaje: string) => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: mensaje });
    };

    const validarFormulario = (): boolean => {
        const newErrors: FormErrors = {};

        // Validar username
        const validacionUsernameResult = usuariosService.validarFormatoUsername(formData.username);
        if (!validacionUsernameResult.valido) {
            newErrors.username = validacionUsernameResult.mensaje;
        }

        // Validar email
        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!usuariosService.validarFormatoEmail(formData.email)) {
            newErrors.email = 'Formato de email inválido';
        }

        // Validar password
        const validacionPassword = usuariosService.validarPassword(formData.password);
        if (!validacionPassword.valida) {
            newErrors.password = validacionPassword.mensaje;
        }

        // Validar confirmación de password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        // Validar nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        // Validar apellido
        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }

        // Validar roles
        const validacionRoles = usuariosService.validarRoles(formData.roles);
        if (!validacionRoles.validos) {
            newErrors.roles = validacionRoles.mensaje;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const verificarUsernameUnico = async (username: string) => {
        if (username.length < 4) return;
        
        try {
            const response = await usuariosService.validarUsername(username);
            if (response.success && response.data !== undefined) {
                setValidacionUsername(response.data ? 'Username disponible' : 'Username ya existe');
            }
        } catch (error) {
            setValidacionUsername('Error al validar username');
        }
    };

    const verificarEmailUnico = async (email: string) => {
        if (!usuariosService.validarFormatoEmail(email)) return;
        
        try {
            const response = await usuariosService.validarEmail(email);
            if (response.success && response.data !== undefined) {
                setValidacionEmail(response.data ? 'Email disponible' : 'Email ya existe');
            }
        } catch (error) {
            setValidacionEmail('Error al validar email');
        }
    };

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error del campo
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }

        // Validaciones en tiempo real
        if (field === 'username' && value.length >= 4) {
            verificarUsernameUnico(value);
        }
        if (field === 'email' && usuariosService.validarFormatoEmail(value)) {
            verificarEmailUnico(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validarFormulario()) {
            mostrarError('Por favor corrija los errores en el formulario');
            return;
        }

        // Verificar que username y email estén disponibles
        if (validacionUsername.includes('ya existe') || validacionEmail.includes('ya existe')) {
            mostrarError('Username o email ya están en uso');
            return;
        }

        setLoading(true);
        try {
            const usuarioData: CrearUsuarioRequest = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                nombre: formData.nombre,
                apellido: formData.apellido,
                roles: formData.roles
            };

            const response = await usuariosService.crearUsuario(usuarioData);
            
            if (response.success) {
                mostrarExito('Usuario creado exitosamente');
                setTimeout(() => {
                    router.push('/administrador/usuarios');
                }, 1500);
            } else {
                mostrarError('Error al crear usuario: ' + response.message);
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error de conexión al crear usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            
            <div className="col-12">
                <Card>
                    <div className="flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-900 m-0">Crear Nuevo Usuario</h2>
                            <p className="text-600 m-0 mt-1">Complete la información para crear un nuevo usuario</p>
                        </div>
                        <Button 
                            label="Volver" 
                            icon="pi pi-arrow-left" 
                            className="p-button-outlined"
                            onClick={() => router.push('/administrador/usuarios')}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid">
                            {/* Información de cuenta */}
                            <div className="col-12">
                                <h3 className="text-lg font-semibold text-900 mb-3">
                                    <i className="pi pi-user mr-2"></i>
                                    Información de Cuenta
                                </h3>
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="username" className="block text-900 font-medium mb-2">
                                    Username *
                                </label>
                                <InputText
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className={`w-full ${errors.username ? 'p-invalid' : ''}`}
                                    placeholder="Ingrese el username"
                                />
                                {errors.username && (
                                    <small className="p-error block mt-1">{errors.username}</small>
                                )}
                                {validacionUsername && (
                                    <small className={`block mt-1 ${validacionUsername.includes('disponible') ? 'text-green-600' : 'text-red-600'}`}>
                                        {validacionUsername}
                                    </small>
                                )}
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="email" className="block text-900 font-medium mb-2">
                                    Email *
                                </label>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                                    placeholder="Ingrese el email"
                                />
                                {errors.email && (
                                    <small className="p-error block mt-1">{errors.email}</small>
                                )}
                                {validacionEmail && (
                                    <small className={`block mt-1 ${validacionEmail.includes('disponible') ? 'text-green-600' : 'text-red-600'}`}>
                                        {validacionEmail}
                                    </small>
                                )}
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="password" className="block text-900 font-medium mb-2">
                                    Contraseña *
                                </label>
                                <Password
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                                    placeholder="Ingrese la contraseña"
                                    toggleMask
                                    feedback={false}
                                />
                                {errors.password && (
                                    <small className="p-error block mt-1">{errors.password}</small>
                                )}
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="confirmPassword" className="block text-900 font-medium mb-2">
                                    Confirmar Contraseña *
                                </label>
                                <Password
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className={`w-full ${errors.confirmPassword ? 'p-invalid' : ''}`}
                                    placeholder="Confirme la contraseña"
                                    toggleMask
                                    feedback={false}
                                />
                                {errors.confirmPassword && (
                                    <small className="p-error block mt-1">{errors.confirmPassword}</small>
                                )}
                            </div>

                            {/* Información personal */}
                            <div className="col-12">
                                <Divider />
                                <h3 className="text-lg font-semibold text-900 mb-3">
                                    <i className="pi pi-id-card mr-2"></i>
                                    Información Personal
                                </h3>
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="nombre" className="block text-900 font-medium mb-2">
                                    Nombre *
                                </label>
                                <InputText
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    className={`w-full ${errors.nombre ? 'p-invalid' : ''}`}
                                    placeholder="Ingrese el nombre"
                                />
                                {errors.nombre && (
                                    <small className="p-error block mt-1">{errors.nombre}</small>
                                )}
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="apellido" className="block text-900 font-medium mb-2">
                                    Apellido *
                                </label>
                                <InputText
                                    id="apellido"
                                    value={formData.apellido}
                                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                                    className={`w-full ${errors.apellido ? 'p-invalid' : ''}`}
                                    placeholder="Ingrese el apellido"
                                />
                                {errors.apellido && (
                                    <small className="p-error block mt-1">{errors.apellido}</small>
                                )}
                            </div>

                            {/* Roles y permisos */}
                            <div className="col-12">
                                <Divider />
                                <h3 className="text-lg font-semibold text-900 mb-3">
                                    <i className="pi pi-shield mr-2"></i>
                                    Roles y Permisos
                                </h3>
                                <Message 
                                    severity="info" 
                                    text="Seleccione los roles que tendrá este usuario en el sistema. Puede asignar múltiples roles."
                                    className="mb-3"
                                />
                            </div>

                            <div className="col-12">
                                <label htmlFor="roles" className="block text-900 font-medium mb-2">
                                    Roles del Usuario *
                                </label>
                                <MultiSelect
                                    id="roles"
                                    value={formData.roles}
                                    options={ROLES_DISPONIBLES.map(rol => ({
                                        label: rol.label,
                                        value: rol.value,
                                        description: rol.description
                                    }))}
                                    onChange={(e) => handleInputChange('roles', e.value)}
                                    placeholder="Seleccione los roles"
                                    className={`w-full ${errors.roles ? 'p-invalid' : ''}`}
                                    itemTemplate={(option) => (
                                        <div className="flex flex-column">
                                            <span className="font-bold">{option.label}</span>
                                            <small className="text-600">{option.description}</small>
                                        </div>
                                    )}
                                    selectedItemTemplate={(option) => {
                                        // ✅ CORREGIDO: Verificar que option existe y tiene label
                                        if (!option || typeof option === 'string') {
                                            const rolInfo = ROLES_DISPONIBLES.find(r => r.value === option);
                                            return rolInfo ? rolInfo.label : option;
                                        }
                                        return option.label || option;
                                    }}
                                />
                                {errors.roles && (
                                    <small className="p-error block mt-1">{errors.roles}</small>
                                )}
                                <small className="text-600 block mt-1">
                                    Los roles determinan los permisos del usuario en el sistema
                                </small>
                            </div>

                            {/* Vista previa de roles seleccionados */}
                            {formData.roles.length > 0 && (
                                <div className="col-12">
                                    <h4 className="text-md font-medium text-900 mb-2">Roles Seleccionados:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.roles.map((rol, index) => {
                                            const rolInfo = usuariosService.obtenerInfoRol(rol);
                                            return (
                                                <div key={index} className="border-1 border-300 border-round p-2 bg-gray-50">
                                                    <div className="flex align-items-center gap-2">
                                                        <i className="pi pi-shield text-600"></i>
                                                        <div>
                                                            <div className="font-bold text-sm">{rolInfo.label}</div>
                                                            <div className="text-xs text-600">{rolInfo.description}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Botones de acción */}
                            <div className="col-12">
                                <Divider />
                                <div className="flex justify-content-end gap-2">
                                    <Button
                                        label="Cancelar"
                                        icon="pi pi-times"
                                        className="p-button-text"
                                        onClick={() => router.push('/administrador/usuarios')}
                                        disabled={loading}
                                    />
                                    <Button
                                        label="Crear Usuario"
                                        icon="pi pi-check"
                                        type="submit"
                                        loading={loading}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}