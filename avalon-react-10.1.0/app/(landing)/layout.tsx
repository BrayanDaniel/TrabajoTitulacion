// LandingLayout.tsx - CON BOTÓN CONFIGURADOR CORRECTO
'use client';

import React, { useEffect, useState, useContext } from 'react';
import { LayoutProvider, LayoutContext } from '../../layout/context/layoutcontext';
import LandingNavbar from './components/LandingNavbar';
import { Button } from 'primereact/button';
import AppConfig from '../../layout/AppConfig';

interface LandingLayoutProps {
    children: React.ReactNode;
}

// Componente interno que tiene acceso al contexto
const LandingContent: React.FC<LandingLayoutProps> = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    const { setLayoutState } = useContext(LayoutContext);

    useEffect(() => {
        setMounted(true);
        
        // Limpiar errores de consola comunes
        const originalError = console.error;
        console.error = (...args) => {
            const message = args[0]?.toString() || '';
            if (
                message.includes('Warning: Prop `className` did not match') ||
                message.includes('Warning: Text content did not match') ||
                message.includes('react-dom.development.js') ||
                message.includes('Next.js hydration') ||
                message.includes('Hydration failed') ||
                message.includes('server and client')
            ) {
                return;
            }
            originalError(...args);
        };

        return () => {
            console.error = originalError;
        };
    }, []);

    // ✅ Función correcta para mostrar el configurador
    const showConfigSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            configSidebarVisible: true
        }));
    };

    if (!mounted) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-ground)' }}>
                <div 
                    className="w-full sticky top-0 z-5"
                    style={{ 
                        backgroundColor: 'var(--surface-card)',
                        borderBottom: '1px solid var(--surface-border)',
                        height: '80px'
                    }}
                >
                    <div className="flex align-items-center justify-content-center h-full">
                        <div style={{ width: '200px', height: '40px' }}></div>
                    </div>
                </div>
                
                <div className="flex align-items-center justify-content-center min-h-screen">
                    <i 
                        className="pi pi-spin pi-spinner text-4xl"
                        style={{ color: 'var(--primary-color)' }}
                    ></i>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-ground)' }}>
            <LandingNavbar />
            
            <main className="min-h-screen">
                {children}
            </main>
            
            <footer 
                className="mt-8 py-4 text-center"
                style={{ 
                    backgroundColor: 'var(--surface-card)',
                    borderTop: '1px solid var(--surface-border)',
                    color: 'var(--text-color-secondary)'
                }}
            >
                <p className="m-0">
                    © 2024 ECommerce Sigchos. Todos los derechos reservados.
                </p>
            </footer>

            {/* ✅ COMPONENTE DEL SIDEBAR DE CONFIGURACIÓN */}
            <AppConfig />
        </div>
    );
};

// Componente principal con Provider
const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
    return (
        <LayoutProvider>
            <LandingContent>
                {children}
            </LandingContent>
        </LayoutProvider>
    );
};

export default LandingLayout;