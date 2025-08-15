'use client';

import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

const LocationSection: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Campos requeridos',
                detail: 'Por favor completa todos los campos',
                life: 3000
            });
            return;
        }

        // Simular envío
        toast.current?.show({
            severity: 'success',
            summary: 'Mensaje enviado',
            detail: 'Gracias por contactarnos. Te responderemos pronto.',
            life: 3000
        });

        // Limpiar formulario
        setContactForm({ name: '', email: '', message: '' });
    };

    const handleInputChange = (field: string, value: string) => {
        setContactForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <>
            <Toast ref={toast} />
            <section id="contact-section" className="location-section py-8" style={{ backgroundColor: 'var(--surface-ground)' }}>
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-4xl font-bold text-900 mb-3">
                            Ubicación y Contacto
                        </h2>
                        <p className="text-xl text-600">
                            Estamos aquí para ayudarte. Encuéntranos o contáctanos directamente.
                        </p>
                    </div>

                    <div className="grid">
                        {/* Información de contacto */}
                        <div className="col-12 lg:col-6 mb-6">
                            <Card className="h-full shadow-3" style={{ backgroundColor: 'var(--surface-card)' }}>
                                <div className="flex align-items-center gap-3 mb-4">
                                    <div 
                                        className="flex align-items-center justify-content-center w-3rem h-3rem border-circle"
                                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                                    >
                                        <i className="pi pi-info-circle text-xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-900 m-0">Información de Contacto</h3>
                                </div>
                                
                                {/* Ubicación */}
                                <div className="flex align-items-start mb-4 p-3 border-round-lg" style={{ backgroundColor: 'var(--surface-100)' }}>
                                    <div 
                                        className="flex align-items-center justify-content-center w-3rem h-3rem border-circle mr-3 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                                    >
                                        <i className="pi pi-map-marker"></i>
                                    </div>
                                    <div>
                                        <h5 className="text-900 mb-2 font-semibold">Nuestra Oficina</h5>
                                        <p className="text-600 m-0 line-height-3">
                                            Cantón Sigchos,<br/>
                                            Provincia Cotopaxi, Ecuador<br/>
                                            Calle Rodrigo Iturralde y pasaje 14 de Noviembre
                                        </p>
                                    </div>
                                </div>

                                {/* Teléfono */}
                                <div className="flex align-items-start mb-4 p-3 border-round-lg" style={{ backgroundColor: 'var(--surface-100)' }}>
                                    <div 
                                        className="flex align-items-center justify-content-center w-3rem h-3rem border-circle mr-3 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                                    >
                                        <i className="pi pi-phone"></i>
                                    </div>
                                    <div>
                                        <h5 className="text-900 mb-2 font-semibold">Teléfono</h5>
                                        <p className="text-600 m-0 line-height-3">
                                            <a href="tel:+593327144242" className="text-primary no-underline hover:underline">
                                                +593 3 271-4242
                                            </a><br/>                                      
                                            <a href="tel:032714242" className="text-primary no-underline hover:underline">
                                                (03) 271-4242
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex align-items-start mb-4 p-3 border-round-lg" style={{ backgroundColor: 'var(--surface-100)' }}>
                                    <div 
                                        className="flex align-items-center justify-content-center w-3rem h-3rem border-circle mr-3 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                                    >
                                        <i className="pi pi-envelope"></i>
                                    </div>
                                    <div>
                                        <h5 className="text-900 mb-2 font-semibold">Email</h5>
                                        <p className="text-600 m-0 line-height-3">
                                            <a href="mailto:gadmunicipal@gadmsigchos.gob.ec" className="text-primary no-underline hover:underline">
                                                gadmunicipal@gadmsigchos.gob.ec
                                            </a><br/>
                                            <a href="mailto:soporte@ecommerce.com" className="text-primary no-underline hover:underline">
                                                soporte@ecommerce.com
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                {/* Horarios */}
                                <div className="flex align-items-start mb-4 p-3 border-round-lg" style={{ backgroundColor: 'var(--surface-100)' }}>
                                    <div 
                                        className="flex align-items-center justify-content-center w-3rem h-3rem border-circle mr-3 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                                    >
                                        <i className="pi pi-clock"></i>
                                    </div>
                                    <div>
                                        <h5 className="text-900 mb-2 font-semibold">Horarios de Atención</h5>
                                        <p className="text-600 m-0 line-height-3">
                                            <span className="font-medium">Lunes a Viernes:</span> 8:00 AM - 5:00 PM<br/>
                                            <span className="font-medium">Sábados:</span> Cerrado<br/>
                                            <span className="font-medium">Domingos:</span> Cerrado
                                        </p>
                                    </div>
                                </div>

                                {/* Redes sociales */}
                                <div className="mt-4 pt-4 border-top-1 border-200">
                                    <div className="flex align-items-center gap-2 mb-3">
                                        <div 
                                            className="flex align-items-center justify-content-center w-2rem h-2rem border-circle"
                                            style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                                        >
                                            <i className="pi pi-share-alt text-sm"></i>
                                        </div>
                                        <h5 className="text-900 m-0 font-semibold">Síguenos en:</h5>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            icon="pi pi-facebook" 
                                            className="p-button-rounded p-button-outlined"
                                            tooltip="Facebook"
                                            style={{
                                                borderColor: 'var(--primary-color)',
                                                color: 'var(--primary-color)',
                                                backgroundColor: 'transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = 'var(--primary-color)';
                                            }}
                                            onClick={() => window.open('https://www.facebook.com/GADMunicipalSigchos/?locale=es_LA', '_blank')}
                                        />
                                        <Button 
                                            icon="pi pi-twitter" 
                                            className="p-button-rounded p-button-outlined"
                                            tooltip="Twitter"
                                            style={{
                                                borderColor: 'var(--primary-color)',
                                                color: 'var(--primary-color)',
                                                backgroundColor: 'transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = 'var(--primary-color)';
                                            }}
                                            onClick={() => window.open('https://x.com/desigchos', '_blank')}
                                        />
                                        <Button 
                                            icon="pi pi-instagram" 
                                            className="p-button-rounded p-button-outlined"
                                            tooltip="Instagram"
                                            style={{
                                                borderColor: 'var(--primary-color)',
                                                color: 'var(--primary-color)',
                                                backgroundColor: 'transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = 'var(--primary-color)';
                                            }}
                                            onClick={() => window.open('https://www.instagram.com/gad_muni.sigchos/', '_blank')}
                                        />
                                        <Button 
                                            icon="pi pi-globe" 
                                            className="p-button-rounded p-button-outlined"
                                            tooltip="Sitio Web"
                                            style={{
                                                borderColor: 'var(--primary-color)',
                                                color: 'var(--primary-color)',
                                                backgroundColor: 'transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = 'var(--primary-color)';
                                            }}
                                            onClick={() => window.open('https://www.gadmsigchos.gob.ec/new/', '_blank')}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Formulario de contacto */}
                        <div className="col-12 lg:col-6">
                            <Card className="h-full shadow-3" style={{ backgroundColor: 'var(--surface-card)' }}>
                                <div className="flex align-items-center gap-3 mb-4">
                                    <div 
                                        className="flex align-items-center justify-content-center w-3rem h-3rem border-circle"
                                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                                    >
                                        <i className="pi pi-send text-xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-900 m-0">Envíanos un Mensaje</h3>
                                </div>
                                
                                <form onSubmit={handleContactSubmit}>
                                    <div className="field mb-4">
                                        <label htmlFor="contact-name" className="block text-900 font-semibold mb-2">
                                            <i className="pi pi-user mr-2" style={{ color: 'var(--primary-color)' }}></i>
                                            Nombre Completo *
                                        </label>
                                        <InputText
                                            id="contact-name"
                                            value={contactForm.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Tu nombre completo"
                                            className="w-full"
                                            style={{
                                                borderRadius: '8px',
                                                padding: '12px',
                                                border: '2px solid var(--surface-border)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'var(--primary-color)';
                                                e.target.style.boxShadow = '0 0 0 0.2rem var(--primary-color-text)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'var(--surface-border)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>

                                    <div className="field mb-4">
                                        <label htmlFor="contact-email" className="block text-900 font-semibold mb-2">
                                            <i className="pi pi-envelope mr-2" style={{ color: 'var(--primary-color)' }}></i>
                                            Email *
                                        </label>
                                        <InputText
                                            id="contact-email"
                                            type="email"
                                            value={contactForm.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="tu@email.com"
                                            className="w-full"
                                            style={{
                                                borderRadius: '8px',
                                                padding: '12px',
                                                border: '2px solid var(--surface-border)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'var(--primary-color)';
                                                e.target.style.boxShadow = '0 0 0 0.2rem var(--primary-color-text)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'var(--surface-border)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>

                                    <div className="field mb-4">
                                        <label htmlFor="contact-message" className="block text-900 font-semibold mb-2">
                                            <i className="pi pi-comment mr-2" style={{ color: 'var(--primary-color)' }}></i>
                                            Mensaje *
                                        </label>
                                        <InputTextarea
                                            id="contact-message"
                                            value={contactForm.message}
                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                            placeholder="Escribe tu mensaje aquí..."
                                            rows={5}
                                            className="w-full"
                                            style={{
                                                borderRadius: '8px',
                                                padding: '12px',
                                                border: '2px solid var(--surface-border)',
                                                transition: 'all 0.3s ease',
                                                resize: 'vertical'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'var(--primary-color)';
                                                e.target.style.boxShadow = '0 0 0 0.2rem var(--primary-color-text)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'var(--surface-border)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        label="Enviar Mensaje"
                                        icon="pi pi-send"
                                        className="w-full"
                                        style={{
                                            backgroundColor: 'var(--primary-color)',
                                            borderColor: 'var(--primary-color)',
                                            color: 'white',
                                            borderRadius: '8px',
                                            padding: '12px 24px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--primary-600)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                </form>

                                {/* ✅ REMOVIDO: Mensaje de tiempo de respuesta para igualar alturas */}
                            </Card>
                        </div>
                    </div>

                    {/* Mapa */}
                    <div className="mt-6">
                        <Card className="shadow-3" style={{ backgroundColor: 'var(--surface-card)' }}>
                            <div className="flex align-items-center gap-3 mb-4">
                                <div 
                                    className="flex align-items-center justify-content-center w-3rem h-3rem border-circle"
                                    style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                                >
                                    <i className="pi pi-map text-xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-900 m-0">Nuestra Ubicación</h3>
                            </div>
                            <div className="border-round-lg overflow-hidden shadow-3" style={{ height: '450px' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5175283390904!2d-78.89244912503511!3d-0.7035531992895908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d4e5dc1c993e47%3A0xdd9e4f8fd625ca29!2sGADM%20SIGCHOS!5e0!3m2!1ses!2sec!4v1753199242706!5m2!1ses!2sec"
                                ></iframe>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LocationSection;