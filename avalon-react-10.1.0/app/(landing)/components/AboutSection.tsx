'use client';

import React, { useContext } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const AboutSection: React.FC = () => {
    const { layoutConfig } = useContext(LayoutContext);
    
    // Obtener el color primario actual del tema
    const primaryColor = `var(--primary-color)`;
    const isDarkTheme = layoutConfig.colorScheme === 'dark';

    const features = [
        {
            icon: 'pi pi-shield',
            title: 'Compra Segura',
            description: 'Transacciones 100% seguras con encriptación SSL y múltiples métodos de pago.'
        },
        {
            icon: 'pi pi-truck',
            title: 'Envío Rápido',
            description: 'Entrega express en 24-48 horas. Envío gratis en compras superiores a $50.'
        },
        {
            icon: 'pi pi-refresh',
            title: 'Devoluciones Fáciles',
            description: '30 días para devolver cualquier producto. Proceso simple y sin complicaciones.'
        },
        {
            icon: 'pi pi-comments',
            title: 'Soporte 24/7',
            description: 'Atención al cliente las 24 horas, los 7 días de la semana. Estamos aquí para ayudarte.'
        }
    ];

    return (
        <section 
            className="about-section py-8"
            style={{
                backgroundColor: isDarkTheme ? 'var(--surface-ground)' : '#ffffff'
            }}
        >
            <div className="container mx-auto px-6">
                <div className="grid align-items-center">
                    {/* Contenido principal */}
                    <div className="col-12 lg:col-6 mb-6 lg:mb-0">
                        <div className="pr-0 lg:pr-6">
                            <h2 
                                className="font-bold mb-4 line-height-2"
                                style={{ 
                                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                                    color: isDarkTheme ? '#ffffff' : '#1f2937'
                                }}
                            >
                                Sobre <span 
                                    style={{ 
                                        background: `linear-gradient(135deg, ${primaryColor} 0%, #64748b 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    Nosotros
                                </span>
                            </h2>
                            <p 
                                className="text-xl line-height-3 mb-4"
                                style={{ 
                                    color: isDarkTheme ? '#d1d5db' : '#6b7280'
                                }}
                            >
                                Fomentar el desarrollo económico y social de los sectores agropecuario,
                                agroindustria, manufactura artesanal, turismo, articulando cadenas de valor,
                                fortaleciendo capacidades locales para mejorar los ingresos económicos de la
                                población, aplicando practicas de sostenibilidad ambiental, adaptación y mitigación
                                al cambio climático.    
                            </p>
                            <p 
                                className="text-lg line-height-3 mb-6"
                                style={{ 
                                    color: isDarkTheme ? '#d1d5db' : '#6b7280'
                                }}
                            >
                                Nuestro objetivo es fomentar el desarrollo económico y social de los sectores agropecuario,
                                agroindustria, manufactura artesanal, turismo, articulando cadenas de valor,
                                fortaleciendo capacidades locales para mejorar los ingresos económicos de la
                                población, aplicando practicas de sostenibilidad ambiental, adaptación y mitigación
                                al cambio climático.
                            </p>
                            
                            {/* Datos destacados */}
                            <div className="grid mb-6">
                                <div className="col-6">
                                    <div className="text-center p-3">
                                        <div 
                                            className="text-3xl font-bold mb-2"
                                            style={{ color: primaryColor }}
                                        >
                                            5+
                                        </div>
                                        <div 
                                            className="text-600"
                                            style={{ color: isDarkTheme ? '#9ca3af' : '#6b7280' }}
                                        >
                                            Años de Experiencia
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center p-3">
                                        <div 
                                            className="text-3xl font-bold mb-2"
                                            style={{ color: primaryColor }}
                                        >
                                            1M+
                                        </div>
                                        <div 
                                            className="text-600"
                                            style={{ color: isDarkTheme ? '#9ca3af' : '#6b7280' }}
                                        >
                                            Órdenes Completadas
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                label="Conoce Más"
                                icon="pi pi-arrow-right"
                                className="p-button-lg"
                                style={{
                                    backgroundColor: primaryColor,
                                    borderColor: primaryColor
                                }}
                            />
                        </div>
                    </div>
                    
                    {/* Características */}
                    <div className="col-12 lg:col-6">
                        <div className="grid">
                            {features.map((feature, index) => (
                                <div key={index} className="col-12 sm:col-6 mb-4">
                                    <Card 
                                        className="h-full text-center hover:shadow-4 transition-all transition-duration-300"
                                        style={{
                                            border: `1px solid ${primaryColor}20`,
                                            backgroundColor: isDarkTheme ? 'var(--surface-card)' : '#ffffff'
                                        }}
                                    >
                                        <div 
                                            className="inline-flex align-items-center justify-content-center w-4rem h-4rem border-circle mb-3"
                                            style={{
                                                backgroundColor: primaryColor,
                                                color: 'white'
                                            }}
                                        >
                                            <i className={`${feature.icon} text-2xl`}></i>
                                        </div>
                                        <h5 
                                            className="mb-3"
                                            style={{ color: isDarkTheme ? '#ffffff' : '#1f2937' }}
                                        >
                                            {feature.title}
                                        </h5>
                                        <p 
                                            className="line-height-3 m-0"
                                            style={{ color: isDarkTheme ? '#d1d5db' : '#6b7280' }}
                                        >
                                            {feature.description}
                                        </p>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Sección de valores */}
                <div 
                    className="mt-8 pt-8"
                    style={{
                        borderTop: `1px solid ${isDarkTheme ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`
                    }}
                >
                    <div className="text-center mb-6">
                        <h3 
                            className="font-bold mb-3"
                            style={{ 
                                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                                color: isDarkTheme ? '#ffffff' : '#1f2937'
                            }}
                        >
                            Nuestros <span 
                                style={{ 
                                    background: `linear-gradient(135deg, ${primaryColor} 0%, #64748b 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Valores
                            </span>
                        </h3>
                        <p 
                            className="text-lg"
                            style={{ color: isDarkTheme ? '#d1d5db' : '#6b7280' }}
                        >
                            Los principios que guían nuestro trabajo cada día
                        </p>
                    </div>
                    
                    <div className="grid">
                        <div className="col-12 md:col-4 text-center mb-4">
                            <i className="pi pi-heart text-4xl text-red-500 mb-3"></i>
                            <h5 
                                className="mb-3"
                                style={{ color: isDarkTheme ? '#ffffff' : '#1f2937' }}
                            >
                                Pasión
                            </h5>
                            <p 
                                style={{ color: isDarkTheme ? '#d1d5db' : '#6b7280' }}
                            >
                                Amamos lo que hacemos y se refleja en cada detalle de nuestro servicio.
                            </p>
                        </div>
                        <div className="col-12 md:col-4 text-center mb-4">
                            <i className="pi pi-users text-4xl text-blue-500 mb-3"></i>
                            <h5 
                                className="mb-3"
                                style={{ color: isDarkTheme ? '#ffffff' : '#1f2937' }}
                            >
                                Comunidad
                            </h5>
                            <p 
                                style={{ color: isDarkTheme ? '#d1d5db' : '#6b7280' }}
                            >
                                Creemos en construir relaciones duraderas con nuestros clientes y socios.
                            </p>
                        </div>
                        <div className="col-12 md:col-4 text-center mb-4">
                            <i className="pi pi-cog text-4xl text-green-500 mb-3"></i>
                            <h5 
                                className="mb-3"
                                style={{ color: isDarkTheme ? '#ffffff' : '#1f2937' }}
                            >
                                Innovación
                            </h5>
                            <p 
                                style={{ color: isDarkTheme ? '#d1d5db' : '#6b7280' }}
                            >
                                Constantemente mejoramos nuestra tecnología y procesos para servir mejor.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;