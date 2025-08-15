'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import cartService, { CartSummary, CartItem } from '../../../services/cartService';
import authService from '../../../services/authService';

// Componente personalizado para cantidad con botones verdes
const QuantitySelector: React.FC<{
    value: number;
    min: number;
    max: number;
    disabled: boolean;
    onChange: (value: number) => void;
}> = ({ value, min, max, disabled, onChange }) => {
    const primaryColor = 'var(--primary-color)';
    
    const handleDecrease = () => {
        if (value > min && !disabled) {
            onChange(value - 1);
        }
    };
    
    const handleIncrease = () => {
        if (value < max && !disabled) {
            onChange(value + 1);
        }
    };
    
    return (
        <div className="flex align-items-center border-round overflow-hidden" style={{ border: '1px solid #dee2e6' }}>
            <Button
                icon="pi pi-minus"
                className="p-button-sm border-none border-round-left border-noround-right"
                style={{
                    backgroundColor: disabled || value <= min ? '#e9ecef' : primaryColor,
                    borderColor: disabled || value <= min ? '#e9ecef' : primaryColor,
                    color: disabled || value <= min ? '#6c757d' : 'white',
                    width: '35px',
                    height: '35px'
                }}
                onClick={handleDecrease}
                disabled={disabled || value <= min}
            />
            <div 
                className="flex align-items-center justify-content-center font-medium"
                style={{
                    minWidth: '50px',
                    height: '35px',
                    backgroundColor: 'white',
                    borderTop: '1px solid #dee2e6',
                    borderBottom: '1px solid #dee2e6'
                }}
            >
                {value}
            </div>
            <Button
                icon="pi pi-plus"
                className="p-button-sm border-none border-round-right border-noround-left"
                style={{
                    backgroundColor: disabled || value >= max ? '#e9ecef' : primaryColor,
                    borderColor: disabled || value >= max ? '#e9ecef' : primaryColor,
                    color: disabled || value >= max ? '#6c757d' : 'white',
                    width: '35px',
                    height: '35px'
                }}
                onClick={handleIncrease}
                disabled={disabled || value >= max}
            />
        </div>
    );
};

const CartPage: React.FC = () => {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    
    const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const primaryColor = 'var(--primary-color)';

    useEffect(() => {
        checkAuthAndLoadCart();
    }, []);

    useEffect(() => {
        const handleCartUpdate = () => {
            loadCartSummary();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const checkAuthAndLoadCart = () => {
        const authStatus = authService.isAuthenticated();
        setIsAuthenticated(authStatus);
        
        if (!authStatus) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Acceso denegado',
                detail: 'Debes iniciar sesión para ver tu carrito',
                life: 3000
            });
            router.push('/auth/login2');
            return;
        }
        
        loadCartSummary();
    };

    const loadCartSummary = () => {
        setLoading(true);
        try {
            const summary = cartService.getCartSummary();
            setCartSummary(summary);
        } catch (error) {
            console.error('Error cargando carrito:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error cargando el carrito',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 0) return;
        
        setUpdating(itemId);
        
        try {
            const result = await cartService.updateQuantity(itemId, newQuantity);
            
            if (result.success) {
                loadCartSummary();
                toast.current?.show({
                    severity: 'success',
                    summary: 'Actualizado',
                    detail: result.message,
                    life: 2000
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: result.message,
                    life: 3000
                });
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error actualizando cantidad',
                life: 3000
            });
        } finally {
            setUpdating(null);
        }
    };

    const handleRemoveItem = (item: CartItem) => {
        confirmDialog({
            message: `¿Estás seguro de eliminar "${item.producto.nombre}" del carrito?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    const result = await cartService.removeFromCart(item.id);
                    
                    if (result.success) {
                        loadCartSummary();
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: result.message,
                            life: 2000
                        });
                    } else {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: result.message,
                            life: 3000
                        });
                    }
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error eliminando producto',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleClearCart = () => {
        confirmDialog({
            message: '¿Estás seguro de vaciar todo el carrito?',
            header: 'Confirmar vaciado',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Vaciar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    const result = await cartService.clearCart();
                    
                    if (result.success) {
                        loadCartSummary();
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Carrito vaciado',
                            detail: result.message,
                            life: 2000
                        });
                    }
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error vaciando carrito',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleProceedToCheckout = () => {
        if (!cartSummary || cartSummary.totalItems === 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Carrito vacío',
                detail: 'Agrega productos antes de proceder',
                life: 3000
            });
            return;
        }
        
        router.push('/checkout');
    };

    if (loading) {
        return (
            <div 
                className="min-h-screen flex align-items-center justify-content-center"
                style={{ backgroundColor: 'var(--surface-ground)' }}
            >
                <ProgressSpinner 
                    style={{ width: '50px', height: '50px' }}
                />
            </div>
        );
    }

    if (!cartSummary || cartSummary.totalItems === 0) {
        return (
            <div 
                className="min-h-screen pt-6"
                style={{ backgroundColor: 'var(--surface-ground)' }}
            >
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="text-center p-6" style={{ backgroundColor: 'var(--surface-card)' }}>
                        <i className="pi pi-shopping-cart text-6xl mb-4" style={{ color: primaryColor }}></i>
                        <h2 className="text-2xl font-bold mb-4 text-900">Tu carrito está vacío</h2>
                        <p className="text-600 mb-6">¡Descubre nuestros productos y encuentra algo que te guste!</p>
                        <Button 
                            label="Ver productos" 
                            icon="pi pi-shopping-bag"
                            onClick={() => router.push('/products')}
                            style={{
                                backgroundColor: primaryColor,
                                borderColor: primaryColor
                            }}
                        />
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <div 
                className="min-h-screen pt-6 pb-6"
                style={{ backgroundColor: 'var(--surface-ground)' }}
            >
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header mejorado */}
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center mb-6 gap-3">
                        <div className="flex align-items-center">
                            <i className="pi pi-shopping-cart mr-3 text-4xl" style={{ color: primaryColor }}></i>
                            <div>
                                <h1 className="text-4xl font-bold m-0" style={{ color: primaryColor }}>
                                    Mi Carrito
                                </h1>
                                <p className="text-600 mt-1 mb-0">
                                    {cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'producto' : 'productos'} en tu carrito
                                </p>
                            </div>
                        </div>
                        <Button 
                            label="Vaciar carrito"
                            icon="pi pi-trash"
                            className="p-button-outlined p-button-danger"
                            onClick={handleClearCart}
                            size="small"
                        />
                    </div>

                    <div className="grid">
                        {/* Items del carrito */}
                        <div className="col-12 lg:col-8">
                            {cartSummary.items.map((item, index) => (
                                <Card key={item.id} className="mb-4" style={{ backgroundColor: 'var(--surface-card)' }}>
                                    <div className="grid align-items-center p-3">
                                        {/* Imagen del producto */}
                                        <div className="col-12 sm:col-3 md:col-2">
                                            <img 
                                                src={item.producto.imagen || 'https://via.placeholder.com/120x120?text=Producto'}
                                                alt={item.producto.nombre}
                                                className="w-full h-auto border-round shadow-2"
                                                style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'cover' }}
                                            />
                                        </div>

                                        {/* Información del producto */}
                                        <div className="col-12 sm:col-9 md:col-10">
                                            <div className="grid align-items-center">
                                                {/* Nombre y descripción */}
                                                <div className="col-12 md:col-4">
                                                    <h3 className="text-xl font-bold mb-1 text-900">{item.producto.nombre}</h3>
                                                    <p className="text-600 text-sm mb-2 line-height-3">
                                                        {item.producto.descripcion}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span 
                                                            className="px-2 py-1 border-round text-xs font-medium"
                                                            style={{ 
                                                                backgroundColor: `${primaryColor}20`,
                                                                color: primaryColor,
                                                                border: `1px solid ${primaryColor}40`
                                                            }}
                                                        >
                                                            {item.producto.categoria.nombre}
                                                        </span>
                                                        <span 
                                                            className="px-2 py-1 border-round text-xs font-medium"
                                                            style={{ 
                                                                backgroundColor: `${primaryColor}15`,
                                                                color: primaryColor,
                                                                border: `1px solid ${primaryColor}30`
                                                            }}
                                                        >
                                                            {item.producto.empresa.nombre}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Precio unitario */}
                                                <div className="col-12 md:col-2 text-center">
                                                    <div className="text-600 text-sm mb-1">Precio unitario:</div>
                                                    <div className="font-bold text-lg" style={{ color: primaryColor }}>
                                                        {cartService.formatPrice(item.producto.precio)}
                                                    </div>
                                                </div>

                                                {/* Cantidad con botones verdes */}
                                                <div className="col-12 md:col-2 text-center">
                                                    <div className="text-600 text-sm mb-2">Cantidad:</div>
                                                    <div className="flex align-items-center justify-content-center gap-2">
                                                        <QuantitySelector
                                                            value={item.cantidad}
                                                            min={1}
                                                            max={item.producto.inventario?.cantidad || 999}
                                                            disabled={updating === item.id}
                                                            onChange={(newValue) => handleQuantityChange(item.id, newValue)}
                                                        />
                                                    </div>
                                                    {item.producto.inventario && (
                                                        <div className="text-xs text-600 mt-1">
                                                            Stock: {item.producto.inventario.cantidad}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Subtotal */}
                                                <div className="col-12 md:col-3 text-center">
                                                    <div className="text-600 text-sm mb-1">Subtotal:</div>
                                                    <div className="font-bold text-xl mb-2" style={{ color: primaryColor }}>
                                                        {cartService.formatPrice(item.subtotal)}
                                                    </div>
                                                    <Button
                                                        icon="pi pi-trash"
                                                        className="p-button-rounded p-button-outlined p-button-danger p-button-sm"
                                                        onClick={() => handleRemoveItem(item)}
                                                        tooltip="Eliminar producto"
                                                        tooltipOptions={{ position: 'bottom' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {updating === item.id && (
                                        <div className="absolute top-0 left-0 w-full h-full flex align-items-center justify-content-center bg-black-alpha-20 border-round">
                                            <ProgressSpinner style={{ width: '30px', height: '30px' }} />
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>

                        {/* Resumen del pedido mejorado */}
                        <div className="col-12 lg:col-4">
                            <Card 
                                className="sticky top-4"
                                style={{ backgroundColor: 'var(--surface-card)' }}
                            >
                                <div className="p-4">
                                    <div className="flex align-items-center mb-4">
                                        <i className="pi pi-calculator mr-2" style={{ color: primaryColor }}></i>
                                        <h3 className="text-xl font-bold m-0" style={{ color: primaryColor }}>
                                            Resumen del pedido
                                        </h3>
                                    </div>
                                    
                                    <div className="flex justify-content-between mb-3">
                                        <span className="text-600">Subtotal ({cartSummary.totalItems} items):</span>
                                        <span className="font-bold">{cartService.formatPrice(cartSummary.subtotal)}</span>
                                    </div>
                                    
                                    <div className="flex justify-content-between mb-3">
                                        <span className="text-600">Impuestos (15%):</span>
                                        <span className="font-bold">{cartService.formatPrice(cartSummary.impuestos)}</span>
                                    </div>
                                    
                                    <div className="flex justify-content-between mb-4">
                                        <span className="text-600">Envío:</span>
                                        <span className="font-bold">
                                            {cartSummary.envio === 0 ? (
                                                <span style={{ color: primaryColor }}>¡Gratis!</span>
                                            ) : (
                                                cartService.formatPrice(cartSummary.envio)
                                            )}
                                        </span>
                                    </div>
                                    
                                    <Divider />
                                    
                                    <div className="flex justify-content-between mb-4">
                                        <span className="text-xl font-bold">Total:</span>
                                        <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                                            {cartService.formatPrice(cartSummary.total)}
                                        </span>
                                    </div>
                                    
                                    <Button
                                        label="Proceder al pago"
                                        icon="pi pi-credit-card"
                                        className="w-full p-3 text-lg font-bold mb-3"
                                        onClick={handleProceedToCheckout}
                                        style={{
                                            backgroundColor: primaryColor,
                                            borderColor: primaryColor
                                        }}
                                    />
                                    
                                    <Button
                                        label="Continuar comprando"
                                        icon="pi pi-shopping-bag"
                                        className="w-full p-button-outlined"
                                        onClick={() => router.push('/products')}
                                        style={{
                                            borderColor: primaryColor,
                                            color: primaryColor
                                        }}
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;