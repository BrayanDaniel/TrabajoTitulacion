'use client';

import React from 'react';

const StatsSection: React.FC = () => {
    const stats = [
        {
            icon: 'pi pi-users',
            number: '50K+',
            label: 'Clientes Satisfechos',
            color: 'text-blue-500'
        },
        {
            icon: 'pi pi-shopping-bag',
            number: '100K+',
            label: 'Productos Vendidos',
            color: 'text-green-500'
        },
        {
            icon: 'pi pi-star-fill',
            number: '4.9',
            label: 'Calificación Promedio',
            color: 'text-yellow-500'
        },
        {
            icon: 'pi pi-globe',
            number: '25+',
            label: 'Países Atendidos',
            color: 'text-purple-500'
        }
    ];

    return (
        <section className="stats-section py-8 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="col-12 sm:col-6 lg:col-3 mb-4">
                            <div className="text-center">
                                <div className={`inline-flex align-items-center justify-content-center w-4rem h-4rem border-circle ${stat.color} bg-white shadow-2 mb-3`}>
                                    <i className={`${stat.icon} text-2xl`}></i>
                                </div>
                                <div className="text-3xl font-bold text-900 mb-2">{stat.number}</div>
                                <div className="text-600 font-medium">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;