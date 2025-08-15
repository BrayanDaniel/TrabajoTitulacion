'use client';

import React, { useEffect, useState, useContext } from 'react';
import { LayoutProvider, LayoutContext } from '../../../layout/context/layoutcontext';
import { Button } from 'primereact/button';
import EmprendedorNavbar from './components/EmprendedorNavbar';
import EmprendedorSidebar from './components/EmprendedorSidebar';
import AppConfig from '../../../layout/AppConfig';
import authService from '../../../services/authService';
import { useRouter } from 'next/navigation';

interface EmprendedorLayoutProps {
    children: React.ReactNode;
}

const EmprendedorLayoutContent: React.FC<EmprendedorLayoutProps> = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { layoutConfig, setLayoutConfig, setLayoutState } = useContext(LayoutContext);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = authService.isAuthenticated();
            const isEmployee = authService.isEmployee();
            
            console.log('🔍 Verificando emprendedor:', { 
                authenticated, 
                isEmployee, 
                userType: authService.getUserType(),
                userInfo: authService.getUserInfo()
            });
            
            if (!authenticated || !isEmployee) {
                console.log('❌ No autorizado para emprendedor, redirigiendo...');
                // ✅ CORREGIDO: Ir al login morado correcto
                router.push('/(full-page)/auth/login');
                return;
            }
            
            setIsAuthenticated(true);
            setMounted(true);
        };

        checkAuth();
    }, [router]);

    const currentLayoutConfig = layoutConfig || {
        theme: 'lara-light-blue',
        colorScheme: 'light',
        menuMode: 'static',
        ripple: true,
        inputStyle: 'outlined'
    };

    if (!mounted || !isAuthenticated) {
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
                        Verificando permisos...
                    </div>
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
                <EmprendedorSidebar />
            </div>

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
                    <EmprendedorNavbar 
                        layoutConfig={currentLayoutConfig}
                        setLayoutConfig={setLayoutConfig}
                    />
                </div>

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

            <AppConfig />
        </div>
    );
};

const EmprendedorLayout: React.FC<EmprendedorLayoutProps> = ({ children }) => {
    return (
        <LayoutProvider>
            <EmprendedorLayoutContent>
                {children}
            </EmprendedorLayoutContent>
        </LayoutProvider>
    );
};

export default EmprendedorLayout;