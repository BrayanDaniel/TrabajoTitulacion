'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../services/authService';

function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        // Verificar autenticación inmediatamente sin renderizar nada
        if (!authService.isAuthenticated()) {
            router.replace('/landing');
        }
    }, [router]);

    // Solo mostrar dashboard si está autenticado
    if (!authService.isAuthenticated()) {
        return null; // No renderizar nada
    }

    // Importar dinámicamente el contenido del dashboard
    const DashboardContent = require('./DashboardContent').default;
    const userInfo = authService.getUserInfo();
    return <DashboardContent userInfo={userInfo} />;
}

export default Dashboard;