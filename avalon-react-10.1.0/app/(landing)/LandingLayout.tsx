'use client';

import React, { useContext } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { PrimeReactContext } from 'primereact/api';
import { classNames } from 'primereact/utils';
import LandingNavbar from './components/LandingNavbar';
import LandingFooter from './components/LandingFooter';
import AppConfig from '../../layout/AppConfig';
import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface LandingLayoutProps {
    children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
    const { layoutConfig } = useContext(LayoutContext);
    const { setRipple } = useContext(PrimeReactContext);

    React.useEffect(() => {
        setRipple?.(layoutConfig.ripple);
    }, [layoutConfig.ripple, setRipple]);

    const containerClassName = classNames(
        'landing-layout',
        {
            'p-ripple-disabled': !layoutConfig.ripple
        }
    );

    return (
        <div className={containerClassName}>
            <LandingNavbar />
            <main className="landing-content">
                {children}
            </main>
            <LandingFooter />
            {/* Tuerca verde de configuración */}
            <AppConfig />
        </div>
    );
};

export default LandingLayout;