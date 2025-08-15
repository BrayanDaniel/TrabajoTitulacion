'use client';

import { useEffect, useState } from 'react';
import AdministradorSidebar from './components/AdministradorSidebar';
import AdminHeader from './components/AdminHeader';

export default function AdministradorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [tieneToken, setTieneToken] = useState(false);

    useEffect(() => {
        const verificarToken = () => {
            try {
                const token = localStorage.getItem('auth_token');
                const usuario = localStorage.getItem('user_info');
                
                if (token && usuario) {
                    setTieneToken(true);
                } else {
                    setTieneToken(false);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error verificando token:', error);
                setTieneToken(false);
                setLoading(false);
            }
        };

        verificarToken();
    }, []);

    if (loading) {
        return (
            <div 
                className="min-h-screen flex align-items-center justify-content-center"
                style={{ backgroundColor: 'var(--surface-ground)' }}
            >
                <div className="text-center">
                    <i 
                        className="pi pi-spin pi-spinner text-4xl mb-3"
                        style={{ color: 'var(--primary-color)' }}
                    ></i>
                    <div style={{ color: 'var(--text-color)' }}>
                        Cargando panel...
                    </div>
                </div>
            </div>
        );
    }

    if (!tieneToken) {
        return (
            <div 
                className="min-h-screen flex align-items-center justify-content-center"
                style={{ backgroundColor: 'var(--surface-ground)' }}
            >
                <div className="text-center">
                    <i className="pi pi-lock text-6xl text-red-500 mb-4"></i>
                    <div className="text-xl font-bold text-900 mb-2">Sesión requerida</div>
                    <div className="text-600 mb-4">Necesitas iniciar sesión para acceder</div>
                    <a href="/(full-page)/auth/login" className="p-button p-button-primary">
                        Ir a Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="layout-wrapper"
            style={{ 
                backgroundColor: 'var(--surface-ground)',
                minHeight: '100vh',
                display: 'flex'
            }}
        >
            {/* ✅ SIDEBAR IZQUIERDO - IGUAL QUE EMPRENDEDOR */}
            <div 
                className="layout-sidebar"
                style={{
                    width: '260px',
                    minHeight: '100vh',
                    backgroundColor: 'var(--surface-card)',
                    borderRight: '1px solid var(--surface-border)',
                    boxShadow: '2px 0 4px rgba(0,0,0,0.08)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 999,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <AdministradorSidebar />
            </div>

            {/* ✅ CONTENIDO PRINCIPAL - IGUAL QUE EMPRENDEDOR */}
            <div 
                className="layout-content"
                style={{
                    marginLeft: '260px',
                    width: 'calc(100% - 260px)',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* ✅ NAVBAR SUPERIOR - IGUAL QUE EMPRENDEDOR */}
                <div 
                    className="layout-topbar"
                    style={{
                        backgroundColor: 'var(--surface-card)',
                        borderBottom: '1px solid var(--surface-border)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 997
                    }}
                >
                    <AdminHeader />
                </div>

                {/* ✅ ÁREA DE CONTENIDO PRINCIPAL - IGUAL QUE EMPRENDEDOR */}
                <div 
                    className="layout-main"
                    style={{
                        flex: 1,
                        padding: '1.5rem 2rem',
                        backgroundColor: 'var(--surface-ground)',
                        overflow: 'auto'
                    }}
                >
                    <div 
                        className="layout-main-content"
                        style={{
                            maxWidth: '100%',
                            margin: '0 auto'
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}