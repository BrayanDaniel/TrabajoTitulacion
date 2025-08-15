'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

const LandingFooter: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-8">
            <div className="container mx-auto px-6">
                <div className="grid">
                    {/* Logo y descripción */}
                    <div className="col-12 md:col-4 mb-4">
                        <div className="flex align-items-center mb-3">
                            <img 
                                src="/layout/images/logo-white.svg" 
                                alt="ECommerce Logo" 
                                height="40" 
                                className="mr-3"
                            />
                            <span className="text-2xl font-bold">ECommerce</span>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Tu tienda online de confianza. Encuentra los mejores productos 
                            con la calidad que mereces y el servicio que necesitas.
                        </p>
                        <div className="flex gap-2">
                            <Button 
                                icon="pi pi-facebook" 
                                className="p-button-rounded p-button-outlined p-button-secondary"
                                tooltip="Facebook"
                            />
                            <Button 
                                icon="pi pi-twitter" 
                                className="p-button-rounded p-button-outlined p-button-secondary"
                                tooltip="Twitter"
                            />
                            <Button 
                                icon="pi pi-instagram" 
                                className="p-button-rounded p-button-outlined p-button-secondary"
                                tooltip="Instagram"
                            />
                            <Button 
                                icon="pi pi-linkedin" 
                                className="p-button-rounded p-button-outlined p-button-secondary"
                                tooltip="LinkedIn"
                            />
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div className="col-12 md:col-2 mb-4">
                        <h5 className="text-white mb-3">Enlaces Rápidos</h5>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Inicio
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Productos
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Ofertas
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Nosotros
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Categorías */}
                    <div className="col-12 md:col-2 mb-4">
                        <h5 className="text-white mb-3">Categorías</h5>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Electrónicos
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Ropa
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Hogar
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Deportes
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Atención al cliente */}
                    <div className="col-12 md:col-2 mb-4">
                        <h5 className="text-white mb-3">Atención al Cliente</h5>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Contacto
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    FAQ
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Envíos
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-300 hover:text-white no-underline">
                                    Devoluciones
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="col-12 md:col-2 mb-4">
                        <h5 className="text-white mb-3">Contacto</h5>
                        <div className="text-gray-300">
                            <div className="flex align-items-center mb-2">
                                <i className="pi pi-map-marker mr-2"></i>
                                <span className="text-sm">Quito, Ecuador</span>
                            </div>
                            <div className="flex align-items-center mb-2">
                                <i className="pi pi-phone mr-2"></i>
                                <span className="text-sm">+593 99 123 4567</span>
                            </div>
                            <div className="flex align-items-center mb-2">
                                <i className="pi pi-envelope mr-2"></i>
                                <span className="text-sm">info@ecommerce.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className="my-6" />

                {/* Copyright */}
                <div className="flex flex-column md:flex-row justify-content-between align-items-center">
                    <div className="text-gray-400 text-sm mb-3 md:mb-0">
                        © 2025 ECommerce. Todos los derechos reservados.
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-400 hover:text-white text-sm no-underline">
                            Política de Privacidad
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white text-sm no-underline">
                            Términos de Servicio
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white text-sm no-underline">
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;