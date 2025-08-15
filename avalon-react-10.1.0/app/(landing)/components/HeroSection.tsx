'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import authService from '../../../services/authService';

const HeroSection: React.FC = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const isAuthenticated = authService.isAuthenticated();

    const handleShopNow = () => {
        if (isAuthenticated) {
            document.getElementById('productos-destacados')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            router.push('/auth/login2');
        }
    };

    const handleExploreProducts = () => {
        document.getElementById('productos-destacados')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Obtener el color primario actual del tema
    const primaryColor = `var(--primary-color)`;
    const isDarkTheme = layoutConfig.colorScheme === 'dark';

    return (
        <>
            {/* Estilos CSS para animaciones */}
            <style jsx>{`
                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                    40%, 43% { transform: translateY(-8px); }
                    70% { transform: translateY(-4px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hero-container {
                    animation: fadeInUp 1s ease-out;
                }
                .feature-card, .stats-card {
                    transition: all 0.3s ease;
                    backdrop-filter: blur(4px);
                    height: 100%;
                }
                .feature-card:hover, .stats-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
                }
                .bg-image {
                    background-image: linear-gradient(
                        135deg, 
                        ${isDarkTheme 
                            ? 'rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.6) 100%'
                            : 'rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.3) 100%'
                        }
                    ),
                    url('https://upload.wikimedia.org/wikipedia/commons/c/ce/PANORAMA_CENTRAL_-_panoramio.jpg');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-attachment: fixed;
                }
                .scroll-indicator {
                    animation: bounce 2s infinite;
                }
                .main-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }
                .hero-grid {
                    display: grid;
                    grid-template-columns: 1fr 500px;
                    gap: 4rem;
                    align-items: center;
                    min-height: 70vh;
                }
                .content-left {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                }
                .cards-right {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .buttons-section {
                    display: flex;
                    gap: 1.5rem;
                    margin-top: 2rem;
                    flex-wrap: wrap;
                }
                @media (max-width: 1024px) {
                    .hero-grid {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                        text-align: center;
                    }
                    .content-left {
                        align-items: center;
                        text-align: center;
                    }
                    .cards-right {
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 1.5rem;
                    }
                    .buttons-section {
                        justify-content: center;
                    }
                }
                @media (max-width: 768px) {
                    .cards-right {
                        grid-template-columns: 1fr;
                    }
                    .buttons-section {
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                    }
                    .main-content {
                        padding: 0 1rem;
                    }
                }
            `}</style>

            <section 
                className="hero-section relative overflow-hidden bg-image"
                style={{ 
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    padding: '4rem 0'
                }}
            >
                {/* Efectos decorativos suaves */}
                <div className="absolute inset-0" style={{ zIndex: 1 }}>
                    <div 
                        className="absolute"
                        style={{ 
                            top: '20%', 
                            right: '15%',
                            width: '400px',
                            height: '400px',
                            background: `radial-gradient(circle, ${primaryColor}08 0%, transparent 70%)`,
                            borderRadius: '50%',
                            filter: 'blur(60px)',
                            animation: 'pulse 8s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute"
                        style={{ 
                            bottom: '25%', 
                            left: '10%',
                            width: '300px',
                            height: '300px',
                            background: `radial-gradient(circle, ${primaryColor}06 0%, transparent 70%)`,
                            borderRadius: '50%',
                            filter: 'blur(50px)',
                            animation: 'pulse 10s ease-in-out infinite reverse'
                        }}
                    />
                </div>

                <div className="main-content w-full relative hero-container" style={{ zIndex: 2, color: 'white' }}>
                    <div className="hero-grid">
                        {/* Contenido izquierdo: Texto + Botones */}
                        <div className="content-left">
                            {/* Badge identificativo */}
                            <div 
                                className="inline-flex align-items-center px-6 py-3 border-round-3xl mb-6"
                                style={{ 
                                    background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}10 100%)`,
                                    backdropFilter: 'blur(2px)',
                                    border: `2px solid ${primaryColor}30`,
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    boxShadow: `0 8px 25px ${primaryColor}15`
                                }}
                            >
                                <i className="pi pi-map-marker mr-3 text-xl" style={{ color: primaryColor }}></i>
                                <span>Proyecto ESPE - Sigchos, Cotopaxi</span>
                            </div>
                            
                            {/* Título principal */}
                            <h1 
                                className="font-bold mb-6 line-height-1" 
                                style={{ 
                                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                    textShadow: '0 8px 40px rgba(0, 0, 0, 0.8)',
                                    color: 'white',
                                    letterSpacing: '-0.02em',
                                    marginBottom: '1.5rem'
                                }}
                            >
                                Emprendimientos y
                                <span 
                                    className="block" 
                                    style={{ 
                                        background: `linear-gradient(135deg, ${primaryColor} 0%, #ffffff 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: 'none',
                                        marginTop: '0.2em'
                                    }}
                                >
                                    Turismo Rural
                                </span>
                            </h1>
                            
                            {/* Descripción */}
                            <p 
                                className="line-height-3 mb-6" 
                                style={{ 
                                    fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                                    opacity: 0.95,
                                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
                                    fontWeight: '400',
                                    maxWidth: '600px'
                                }}
                            >
                                Plataforma digital para promocionar productos locales, difundir 
                                atractivos turísticos y capacitar en herramientas tecnológicas 
                                a las comunidades del cantón Sigchos, provincia de Cotopaxi.
                            </p>
                            
                            {/* Botones de acción */}
                            <div className="buttons-section">
                                <Button
                                    label={isAuthenticated ? "Explorar Plataforma" : "Iniciar Sesión"}
                                    icon={isAuthenticated ? "pi pi-globe" : "pi pi-sign-in"}
                                    className="p-button-lg"
                                    style={{ 
                                        padding: '1.2rem 2.5rem',
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                        borderRadius: '12px',
                                        backgroundColor: primaryColor,
                                        border: 'none',
                                        boxShadow: `0 12px 35px ${primaryColor}40`,
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow = `0 18px 45px ${primaryColor}60`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = `0 12px 35px ${primaryColor}40`;
                                    }}
                                    onClick={handleShopNow}
                                />
                                <Button
                                    label="Conocer Más"
                                    icon="pi pi-info-circle"
                                    className="p-button-lg p-button-outlined"
                                    style={{ 
                                        borderColor: 'rgba(255, 255, 255, 0.8)',
                                        color: 'white',
                                        padding: '1.2rem 2.5rem',
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                        borderRadius: '12px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(2px)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = `${primaryColor}20`;
                                        e.currentTarget.style.borderColor = primaryColor;
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                    onClick={handleExploreProducts}
                                />
                            </div>
                        </div>
                        
                        {/* Tarjetas derecha - Grid 2x2 */}
                        <div className="cards-right">
                            {/* Tienda Virtual */}
                            <div 
                                className="feature-card p-5 border-round-3xl text-center cursor-pointer"
                                style={{ 
                                    background: `linear-gradient(135deg, ${primaryColor}18 0%, ${primaryColor}12 100%)`,
                                    border: `1px solid ${primaryColor}25`,
                                    boxShadow: `0 12px 30px ${primaryColor}15`
                                }}
                            >
                                <div 
                                    className="p-3 border-round-xl mx-auto mb-3"
                                    style={{ 
                                        backgroundColor: `${primaryColor}25`,
                                        width: 'fit-content'
                                    }}
                                >
                                    <i className="pi pi-shopping-cart text-3xl" style={{ color: primaryColor }}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'white' }}>Tienda Virtual</h3>
                                <p className="text-sm opacity-90 mb-0" style={{ color: 'white' }}>Productos locales de emprendedores</p>
                            </div>

                            {/* Turismo Rural */}
                            <div 
                                className="feature-card p-5 border-round-3xl text-center cursor-pointer"
                                style={{ 
                                    background: `linear-gradient(135deg, ${primaryColor}18 0%, ${primaryColor}12 100%)`,
                                    border: `1px solid ${primaryColor}25`,
                                    boxShadow: `0 12px 30px ${primaryColor}15`
                                }}
                            >
                                <div 
                                    className="p-3 border-round-xl mx-auto mb-3"
                                    style={{ 
                                        backgroundColor: `${primaryColor}25`,
                                        width: 'fit-content'
                                    }}
                                >
                                    <i className="pi pi-map text-3xl" style={{ color: primaryColor }}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'white' }}>Turismo Rural</h3>
                                <p className="text-sm opacity-90 mb-0" style={{ color: 'white' }}>88 atractivos turísticos únicos</p>
                            </div>

                            {/* Capacitación Digital */}
                            <div 
                                className="feature-card p-5 border-round-3xl text-center cursor-pointer"
                                style={{ 
                                    background: `linear-gradient(135deg, ${primaryColor}18 0%, ${primaryColor}12 100%)`,
                                    border: `1px solid ${primaryColor}25`,
                                    boxShadow: `0 12px 30px ${primaryColor}15`
                                }}
                            >
                                <div 
                                    className="p-3 border-round-xl mx-auto mb-3"
                                    style={{ 
                                        backgroundColor: `${primaryColor}25`,
                                        width: 'fit-content'
                                    }}
                                >
                                    <i className="pi pi-desktop text-3xl" style={{ color: primaryColor }}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'white' }}>Capacitación Digital</h3>
                                <p className="text-sm opacity-90 mb-0" style={{ color: 'white' }}>Herramientas tecnológicas modernas</p>
                            </div>

                            {/* Estadística Principal - 18,460 Habitantes */}
                            <div 
                                className="stats-card p-5 border-round-3xl text-center cursor-pointer"
                                style={{ 
                                    background: `linear-gradient(135deg, ${primaryColor}25 0%, ${primaryColor}18 100%)`,
                                    border: `2px solid ${primaryColor}35`,
                                    boxShadow: `0 15px 35px ${primaryColor}20`
                                }}
                            >
                                <div 
                                    className="p-3 border-round-xl mx-auto mb-3"
                                    style={{ 
                                        backgroundColor: `${primaryColor}30`,
                                        width: 'fit-content'
                                    }}
                                >
                                    <i className="pi pi-users text-3xl" style={{ color: primaryColor }}></i>
                                </div>
                                <h3 className="text-3xl font-bold mb-2" style={{ color: 'white' }}>18,460</h3>
                                <p className="text-lg font-semibold mb-1" style={{ color: 'white' }}>Habitantes</p>
                                <p className="text-xs opacity-90 mb-0" style={{ color: 'white' }}>Población beneficiaria</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indicador de scroll */}
                <div 
                    className="absolute text-center cursor-pointer" 
                    style={{ bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
                    onClick={handleExploreProducts}
                >
                    <div 
                        className="p-4 border-round-2xl"
                        style={{ 
                            background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}12 100%)`,
                            backdropFilter: 'blur(2px)',
                            border: `1px solid ${primaryColor}30`,
                            transition: 'all 0.3s ease',
                            color: 'white'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}30 0%, ${primaryColor}18 100%)`;
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}12 100%)`;
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div className="text-sm mb-2 font-medium">Explorar productos</div>
                        <i 
                            className="pi pi-chevron-down text-xl scroll-indicator" 
                            style={{ color: primaryColor }}
                        ></i>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;