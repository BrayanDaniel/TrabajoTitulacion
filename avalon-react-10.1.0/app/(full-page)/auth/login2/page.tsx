'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import React, { useState, useRef, useEffect, useContext } from 'react';
import type { Page } from '@/types';
import { Checkbox } from 'primereact/checkbox';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import authService from '../../../../services/authService';

const Login: Page = () => {
    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);
    const [checked, setChecked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        general: ''
    });
    const toast = useRef<Toast>(null);

    // Verificar si ya está autenticado al cargar la página
    useEffect(() => {
        if (authService.isAuthenticated()) {
            // Redirigir según el rol del usuario
            const redirectPath = authService.getRedirectPath();
            console.log('🔄 Usuario ya autenticado, redirigiendo a:', redirectPath);
            router.push(redirectPath);
            return;
        }

        // Cargar username recordado si existe
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            setCredentials(prev => ({
                ...prev,
                username: rememberedUsername
            }));
            setChecked(true);
        }
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar errores cuando el usuario empieza a escribir
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
                general: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors = {
            username: '',
            password: '',
            general: ''
        };

        if (!credentials.username.trim()) {
            newErrors.username = 'El usuario es requerido';
        }

        if (!credentials.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (credentials.password.length < 3) {
            newErrors.password = 'La contraseña debe tener al menos 3 caracteres';
        }

        setErrors(newErrors);
        return !newErrors.username && !newErrors.password;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors(prev => ({ ...prev, general: '' }));

        try {
            const result = await authService.login(
                credentials.username.trim(),
                credentials.password
            );

            if (result.success && result.data) {
                // Manejar "Recordarme"
                if (checked) {
                    localStorage.setItem('rememberedUsername', credentials.username);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }

                // Obtener información del usuario para determinar redirección
                const userInfo = authService.getUserInfo();
                const userType = authService.getUserType();
                const redirectPath = authService.getRedirectPath();

                // Mostrar mensaje personalizado según el tipo de usuario
                let welcomeMessage = '';
                switch (userType) {
                    case 'admin':
                        welcomeMessage = `¡Bienvenido, Administrador ${credentials.username}! Accediendo al panel de control...`;
                        break;
                    case 'employee':
                        welcomeMessage = `¡Bienvenido, ${credentials.username}! Accediendo al panel de gestión...`;
                        break;
                    case 'customer':
                    default:
                        welcomeMessage = `¡Bienvenido, ${credentials.username}! Redirigiendo a la tienda...`;
                        break;
                }

                toast.current?.show({
                    severity: 'success',
                    summary: '¡Acceso autorizado!',
                    detail: welcomeMessage,
                    life: 2500
                });

                // Redirigir según el rol del usuario
                console.log(`🔄 Redirigiendo a: ${redirectPath} (Tipo: ${userType})`);
                setTimeout(() => {
                    router.push(redirectPath);
                }, 1500);

            } else {
                setErrors(prev => ({
                    ...prev,
                    general: result.message || 'Credenciales incorrectas'
                }));
                
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error de autenticación',
                    detail: result.message || 'Credenciales incorrectas',
                    life: 4000
                });
            }
        } catch (error) {
            console.error('Error en login:', error);
            const errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
            
            setErrors(prev => ({
                ...prev,
                general: errorMessage
            }));
            
            toast.current?.show({
                severity: 'error',
                summary: 'Error de conexión',
                detail: errorMessage,
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const handleGoBack = () => {
        router.push('/');
    };

    return (
        <>
            <Toast ref={toast} />
            
            {/* Contenedor principal con fondo verde de Avalon */}
            <div 
                className="min-h-screen flex align-items-center justify-content-center p-4 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, var(--green-50) 0%, var(--green-100) 25%, var(--green-200) 50%, var(--green-300) 75%, var(--green-400) 100%)'
                }}
            >
                {/* Botón volver con estilos verdes de Avalon */}
                <Button
                    icon="pi pi-arrow-left"
                    label="Volver al inicio"
                    className="p-button-rounded p-button-outlined absolute top-0 left-0 m-4"
                    onClick={handleGoBack}
                    style={{
                        backgroundColor: 'var(--surface-overlay)',
                        borderColor: 'var(--green-500)',
                        color: 'var(--green-600)',
                        backdropFilter: 'blur(10px)'
                    }}
                />

                {/* Formas decorativas usando variables verdes de Avalon */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div 
                        className="absolute border-circle opacity-20 animation-duration-3000 animation-iteration-infinite"
                        style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: 'var(--green-300)',
                            top: '15%',
                            left: '10%',
                            animation: 'bounce 3s ease-in-out infinite'
                        }}
                    ></div>
                    <div 
                        className="absolute border-circle opacity-30 animation-duration-2000 animation-iteration-infinite"
                        style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'var(--green-400)',
                            top: '60%',
                            right: '15%',
                            animation: 'bounce 2s ease-in-out infinite reverse'
                        }}
                    ></div>
                    <div 
                        className="absolute border-circle opacity-25 animation-duration-4000 animation-iteration-infinite"
                        style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: 'var(--green-200)',
                            bottom: '25%',
                            left: '20%',
                            animation: 'bounce 4s ease-in-out infinite'
                        }}
                    ></div>
                </div>

                {/* Card principal usando completamente Avalon */}
                <Card 
                    className="w-full shadow-4 border-round-2xl overflow-hidden"
                    style={{
                        maxWidth: '480px',
                        backgroundColor: 'var(--surface-card)',
                        border: '1px solid var(--surface-border)',
                        backdropFilter: 'blur(15px)'
                    }}
                >
                    {/* Header del card */}
                    <div className="text-center p-6 pb-4">
                        {/* Ícono principal con gradiente verde */}
                        <div className="flex justify-content-center mb-4">
                            <div 
                                className="border-circle flex align-items-center justify-content-center shadow-3"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    background: 'linear-gradient(45deg, var(--green-500), var(--green-600))'
                                }}
                            >
                                <i className="pi pi-user text-white text-4xl"></i>
                            </div>
                        </div>
                        
                        {/* Título */}
                        <h1 
                            className="text-4xl font-bold mb-2 m-0"
                            style={{ color: 'var(--green-600)' }}
                        >
                            Bienvenido
                        </h1>
                        <p className="text-600 text-lg m-0">
                            Inicia sesión en <span className="font-bold" style={{ color: 'var(--green-500)' }}>ECommerce Sigchos</span>
                        </p>
                    </div>

                    <Divider className="m-0" />

                    {/* Contenido del formulario */}
                    <div className="p-6">
                        {/* Mensaje de error general */}
                        {errors.general && (
                            <Message 
                                severity="error" 
                                text={errors.general}
                                className="mb-4 w-full"
                            />
                        )}

                        {/* Formulario usando grid de PrimeFlex */}
                        <div className="formgrid grid">
                            {/* Campo Usuario */}
                            <div className="field col-12 mb-4">
                                <label 
                                    htmlFor="username" 
                                    className="block mb-2 font-semibold"
                                    style={{ color: 'var(--text-color)' }}
                                >
                                    <i className="pi pi-user mr-2" style={{ color: 'var(--green-500)' }}></i>
                                    Usuario
                                </label>
                                <InputText
                                    id="username"
                                    name="username"
                                    type="text"
                                    className={`w-full p-3 text-lg ${errors.username ? 'p-invalid' : ''}`}
                                    value={credentials.username}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    disabled={loading}
                                    placeholder="Ingresa tu usuario"
                                    autoComplete="username"
                                    style={{
                                        backgroundColor: 'var(--surface-ground)',
                                        borderColor: errors.username ? 'var(--red-500)' : 'var(--surface-border)',
                                        color: 'var(--text-color)'
                                    }}
                                />
                                {errors.username && (
                                    <small className="block mt-1 text-red-500">{errors.username}</small>
                                )}
                            </div>

                            {/* Campo Contraseña */}
                            <div className="field col-12 mb-4">
                                <label 
                                    htmlFor="password" 
                                    className="block mb-2 font-semibold"
                                    style={{ color: 'var(--text-color)' }}
                                >
                                    <i className="pi pi-lock mr-2" style={{ color: 'var(--green-500)' }}></i>
                                    Contraseña
                                </label>
                                <Password
                                    id="password"
                                    name="password"
                                    className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                                    inputClassName="p-3 text-lg w-full"
                                    value={credentials.password}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    disabled={loading}
                                    placeholder="Ingresa tu contraseña"
                                    toggleMask
                                    feedback={false}
                                    autoComplete="current-password"
                                    pt={{
                                        input: {
                                            style: {
                                                backgroundColor: 'var(--surface-ground)',
                                                borderColor: errors.password ? 'var(--red-500)' : 'var(--surface-border)',
                                                color: 'var(--text-color)'
                                            }
                                        }
                                    }}
                                />
                                {errors.password && (
                                    <small className="block mt-1 text-red-500">{errors.password}</small>
                                )}
                            </div>

                            {/* Checkbox Recordarme */}
                            <div className="field col-12 mb-4">
                                <div className="flex align-items-center">
                                    <Checkbox
                                        id="rememberme"
                                        onChange={(e) => setChecked(e.checked ?? false)}
                                        checked={checked}
                                        className="mr-2"
                                        disabled={loading}
                                    />
                                    <label 
                                        htmlFor="rememberme" 
                                        className="cursor-pointer"
                                        style={{ color: 'var(--text-color)' }}
                                    >
                                        Recordar mi usuario
                                    </label>
                                </div>
                            </div>

                            {/* Botón de login con gradiente verde */}
                            <div className="field col-12 mb-4">
                                <Button
                                    label={loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                                    icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                                    onClick={handleLogin}
                                    className="w-full p-3 text-lg font-bold"
                                    loading={loading}
                                    disabled={loading}
                                    style={{
                                        background: 'linear-gradient(45deg, var(--green-500), var(--green-600))',
                                        borderColor: 'var(--green-500)',
                                        color: 'white'
                                    }}
                                />
                            </div>

                            {/* Links adicionales */}
                            <div className="field col-12">
                                <div className="flex justify-content-between align-items-center flex-wrap gap-3">
                                    <Button
                                        label="¿Olvidaste tu contraseña?"
                                        className="p-button-link p-0"
                                        style={{ color: 'var(--green-500)' }}
                                        onClick={() => {
                                            toast.current?.show({
                                                severity: 'info',
                                                summary: 'Próximamente',
                                                detail: 'Esta función estará disponible pronto',
                                                life: 3000
                                            });
                                        }}
                                    />
                                    <Button
                                        label="Crear cuenta"
                                        className="p-button-link p-0 font-bold"
                                        style={{ color: 'var(--green-600)' }}
                                        onClick={() => {
                                            toast.current?.show({
                                                severity: 'info',
                                                summary: 'Registro próximamente',
                                                detail: 'El registro estará disponible pronto',
                                                life: 3000
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div 
                        className="text-center p-4"
                        style={{
                            backgroundColor: 'var(--surface-50)',
                            borderTop: '1px solid var(--surface-border)'
                        }}
                    >
                        <p className="text-600 text-sm m-0">
                            © 2025 ECommerce Sigchos - <span style={{ color: 'var(--green-600)' }} className="font-bold">Proyecto ESPE</span>
                        </p>
                    </div>
                </Card>

                {/* SVG de fondo usando variables verdes de Avalon */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="absolute bottom-0 w-screen h-auto" 
                    viewBox="0 0 1440 320"
                    style={{ zIndex: -1 }}
                >
                    <defs>
                        <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: 'var(--green-300)', stopOpacity: 0.8 }} />
                            <stop offset="50%" style={{ stopColor: 'var(--green-400)', stopOpacity: 0.6 }} />
                            <stop offset="100%" style={{ stopColor: 'var(--green-500)', stopOpacity: 0.8 }} />
                        </linearGradient>
                        <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: 'var(--green-400)', stopOpacity: 0.6 }} />
                            <stop offset="50%" style={{ stopColor: 'var(--green-500)', stopOpacity: 0.4 }} />
                            <stop offset="100%" style={{ stopColor: 'var(--green-600)', stopOpacity: 0.6 }} />
                        </linearGradient>
                    </defs>
                    <path 
                        fill="url(#wave1)" 
                        d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                    <path 
                        fill="url(#wave2)" 
                        d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,213.3C672,213,768,171,864,144C960,117,1056,107,1152,128C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </svg>
            </div>
        </>
    );
};

export default Login;