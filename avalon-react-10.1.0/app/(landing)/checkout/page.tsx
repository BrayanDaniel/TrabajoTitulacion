'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import cartService, { CartSummary } from '../../../services/cartService';
import authService from '../../../services/authService';
import kushkiService from '../../../services/kushkiService';
import clientesService from '../../../services/clientesService';
import CheckoutClienteForm from './components/CheckoutClienteForm';

const CheckoutPage: React.FC = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const toast = useRef<Toast>(null);

    // Estados principales
    const [mounted, setMounted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Estados de cliente
    const [clienteData, setClienteData] = useState<any>(null);
    const [clienteFormValid, setClienteFormValid] = useState(false);
    
    // Estados de pago
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentResult, setPaymentResult] = useState<any>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string>('');

    const primaryColor = 'var(--primary-color)';

    // Pasos del checkout con íconos
    const steps = [
        { 
            label: 'Datos de Envío',
            icon: 'pi pi-user'
        },
        { 
            label: 'Revisión',
            icon: 'pi pi-check-square'
        },
        { 
            label: 'Pago',
            icon: 'pi pi-credit-card'
        },
        { 
            label: 'Confirmación',
            icon: 'pi pi-check-circle'
        }
    ];

    // ✅ MONTAJE
    useEffect(() => {
        setMounted(true);
        window.scrollTo(0, 0);
    }, []);

    // ✅ VERIFICAR AUTENTICACIÓN
    useEffect(() => {
        if (!mounted) return;

        const checkAuth = () => {
            const authStatus = authService.isAuthenticated();
            setIsAuthenticated(authStatus);
            
            if (!authStatus) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Acceso denegado',
                    detail: 'Debes iniciar sesión para acceder al checkout',
                    life: 3000
                });
                router.push('/auth/login2');
                return;
            }
        };

        checkAuth();
    }, [mounted, router]);

    // ✅ CARGAR CARRITO
    useEffect(() => {
        if (!mounted || !isAuthenticated) return;
        loadCartSummary();
    }, [mounted, isAuthenticated]);

    const loadCartSummary = () => {
        setLoading(true);
        try {
            const summary = cartService.getCartSummary();
            
            if (summary.totalItems === 0) {
                toast.current?.show({
                    severity: 'info',
                    summary: 'Carrito vacío',
                    detail: 'Tu carrito está vacío. Agrega productos antes de proceder.',
                    life: 3000
                });
                router.push('/products');
                return;
            }
            
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

    // ✅ PROCESAR CHECKOUT USANDO SOLO MÉTODOS DISPONIBLES
    const handleProcessCheckout = async () => {
        if (!cartSummary || !clienteData) {
            return;
        }

        setProcessing(true);
        setPaymentProcessing(true);

        try {
            console.log('🚀 Iniciando checkout...');

            // ✅ PASO 1: Validar carrito
            console.log('⚡ Validando carrito...');
            const validationResult = await cartService.validateCartForCheckout();
            
            if (!validationResult.success) {
                throw new Error(validationResult.message);
            }

            // ✅ PASO 2: Mover inmediátamente a paso de pago para mejor UX
            setCurrentStep(2);

            // ✅ PASO 3: Procesar usando el método de cartService
            console.log('📝 Procesando checkout...');
            const checkoutResult = await cartService.processCheckout(clienteData);
            
            if (!checkoutResult.success || !checkoutResult.data) {
                throw new Error(checkoutResult.message || 'Error creando la orden');
            }

            const finalOrderNumber = checkoutResult.data.orderId;
            setOrderNumber(finalOrderNumber);
            console.log('✅ Orden creada:', finalOrderNumber);

            // ✅ PASO 4: Procesar pago
            console.log('💳 Procesando pago...');
            const paymentData = {
                amount: cartSummary.total,
                currency: 'USD',
                orderNumber: finalOrderNumber,
                description: `Pago ECommerce - ${cartSummary.totalItems} items`
            };

            const paymentResult = await kushkiService.processPayment(paymentData);

            if (!paymentResult.success) {
                throw new Error(paymentResult.message || 'Error procesando el pago');
            }

            console.log('✅ Pago exitoso');

            // ✅ PASO 5: Completar venta (usando cartService)
            console.log('🏁 Completando venta...');
            try {
                await cartService.completarVenta(finalOrderNumber);
                console.log('✅ Venta completada');
            } catch (error) {
                console.warn('⚠️ Error completando venta, pero pago fue exitoso:', error);
                // No lanzar error aquí porque el pago ya fue exitoso
            }

            // ✅ PASO 6: Mostrar éxito
            console.log('🎉 Checkout completado exitosamente');
            setPaymentResult(paymentResult);
            setCurrentStep(3);
            setShowSuccessDialog(true);

        } catch (error: any) {
            console.error('❌ Error en checkout:', error);
            
            // Volver al paso anterior en caso de error
            setCurrentStep(1);
            
            // Mensaje de error más específico
            let errorMessage = 'Hubo un problema procesando tu orden. ';
            
            if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
                errorMessage += 'El servidor está tardando más de lo usual. Por favor intenta nuevamente.';
            } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
                errorMessage += 'Problemas de conexión. Verifica tu internet e intenta nuevamente.';
            } else if (error.message?.includes('pago') || error.message?.includes('payment')) {
                errorMessage += 'Error en el procesamiento del pago. Verifica tus datos e intenta nuevamente.';
            } else {
                errorMessage += error.message || 'Error desconocido. Intenta nuevamente.';
            }
            
            toast.current?.show({
                severity: 'error',
                summary: 'Error en el proceso',
                detail: errorMessage,
                life: 8000
            });
        } finally {
            setProcessing(false);
            setPaymentProcessing(false);
        }
    };

    const handleSuccessDialogClose = () => {
        setShowSuccessDialog(false);
        clientesService.limpiarDatosClienteLocal();
        router.push('/');
    };

    const renderClienteForm = () => (
        <Card 
            className="mb-4 shadow-3" 
            style={{ 
                backgroundColor: 'var(--surface-card)',
                border: `1px solid ${primaryColor}20`
            }}
        >
            <div className="p-4">
                <div className="flex align-items-center mb-4">
                    <div 
                        className="flex align-items-center justify-content-center border-circle mr-3"
                        style={{
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor,
                            width: '40px',
                            height: '40px'
                        }}
                    >
                        <i className="pi pi-user text-lg"></i>
                    </div>
                    <h3 className="text-xl font-bold m-0" style={{ color: primaryColor }}>
                        Información de Envío
                    </h3>
                </div>
                <CheckoutClienteForm 
                    onClienteData={(data) => {
                        setClienteData(data);
                    }}
                    onValidated={(isValid) => {
                        setClienteFormValid(isValid);
                    }}
                />
            </div>
        </Card>
    );

    const renderCartReview = () => (
        <Card 
            className="mb-4 shadow-3" 
            style={{ 
                backgroundColor: 'var(--surface-card)',
                border: `1px solid ${primaryColor}20`
            }}
        >
            <div className="p-4">
                <div className="flex align-items-center justify-content-between mb-4">
                    <div className="flex align-items-center">
                        <div 
                            className="flex align-items-center justify-content-center border-circle mr-3"
                            style={{
                                backgroundColor: `${primaryColor}15`,
                                color: primaryColor,
                                width: '40px',
                                height: '40px'
                            }}
                        >
                            <i className="pi pi-shopping-cart text-lg"></i>
                        </div>
                        <h3 className="text-xl font-bold m-0" style={{ color: primaryColor }}>
                            Resumen de tu Pedido
                        </h3>
                    </div>
                    <Badge 
                        value={cartSummary?.totalItems} 
                        severity="success"
                        style={{ backgroundColor: primaryColor }}
                    />
                </div>
                
                {/* Datos del cliente */}
                {clienteData && (
                    <div className="mb-4 p-4 border-round shadow-1" style={{ backgroundColor: `${primaryColor}08` }}>
                        <div className="flex align-items-center mb-3">
                            <i className="pi pi-map-marker mr-2" style={{ color: primaryColor }}></i>
                            <h4 className="font-bold m-0" style={{ color: primaryColor }}>Datos de envío</h4>
                        </div>
                        <div className="grid text-sm">
                            <div className="col-12 md:col-6">
                                <div className="mb-2">
                                    <i className="pi pi-user mr-2 text-600"></i>
                                    <strong>Nombre:</strong> {clienteData.nombre} {clienteData.apellido}
                                </div>
                                <div className="mb-2">
                                    <i className="pi pi-id-card mr-2 text-600"></i>
                                    <strong>Cédula:</strong> {clienteData.documento}
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="mb-2">
                                    <i className="pi pi-envelope mr-2 text-600"></i>
                                    <strong>Email:</strong> {clienteData.email}
                                </div>
                                <div className="mb-2">
                                    <i className="pi pi-phone mr-2 text-600"></i>
                                    <strong>Teléfono:</strong> {clienteData.telefono}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-0">
                                    <i className="pi pi-home mr-2 text-600"></i>
                                    <strong>Dirección:</strong> {clienteData.direccion}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <Divider />
                
                <div className="mb-4">
                    <h4 className="font-bold mb-3 text-900">
                        <i className="pi pi-list mr-2" style={{ color: primaryColor }}></i>
                        Productos en tu pedido
                    </h4>
                    {cartSummary?.items.map((item, index) => (
                        <div key={item.id} className="flex justify-content-between align-items-center py-3 px-2 border-round hover:surface-hover">
                            <div className="flex align-items-center">
                                <img 
                                    src={item.producto.imagen || 'https://via.placeholder.com/60x60?text=P'}
                                    alt={item.producto.nombre}
                                    className="w-4rem h-4rem object-cover border-round shadow-2 mr-3"
                                />
                                <div>
                                    <div className="font-bold text-900 mb-1">{item.producto.nombre}</div>
                                    <div className="text-600 text-sm mb-1">
                                        <i className="pi pi-tag mr-1"></i>
                                        Cantidad: {item.cantidad}
                                    </div>
                                    <div className="flex gap-2">
                                        <span 
                                            className="px-2 py-1 border-round text-xs font-medium"
                                            style={{ 
                                                backgroundColor: `${primaryColor}15`,
                                                color: primaryColor
                                            }}
                                        >
                                            {item.producto.categoria.nombre}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg" style={{ color: primaryColor }}>
                                    {cartService.formatPrice(item.subtotal)}
                                </div>
                                <div className="text-600 text-sm">
                                    {cartService.formatPrice(item.producto.precio)} c/u
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-top-1 surface-border pt-4">
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="flex justify-content-between mb-2">
                                <span className="flex align-items-center">
                                    <i className="pi pi-calculator mr-2 text-600"></i>
                                    Subtotal:
                                </span>
                                <span className="font-bold">{cartService.formatPrice(cartSummary?.subtotal || 0)}</span>
                            </div>
                            <div className="flex justify-content-between mb-2">
                                <span className="flex align-items-center">
                                    <i className="pi pi-percentage mr-2 text-600"></i>
                                    Impuestos (15%):
                                </span>
                                <span className="font-bold">{cartService.formatPrice(cartSummary?.impuestos || 0)}</span>
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="flex justify-content-between mb-3">
                                <span className="flex align-items-center">
                                    <i className="pi pi-send mr-2 text-600"></i>
                                    Envío:
                                </span>
                                <span className="font-bold">
                                    {cartSummary?.envio === 0 ? (
                                        <span style={{ color: primaryColor }}>
                                            <i className="pi pi-check mr-1"></i>
                                            ¡Gratis!
                                        </span>
                                    ) : (
                                        cartService.formatPrice(cartSummary?.envio || 0)
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="col-12">
                            <Divider />
                            <div className="flex justify-content-between text-xl">
                                <span className="font-bold flex align-items-center">
                                    <i className="pi pi-wallet mr-2" style={{ color: primaryColor }}></i>
                                    Total:
                                </span>
                                <span className="font-bold text-2xl" style={{ color: primaryColor }}>
                                    {cartService.formatPrice(cartSummary?.total || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderPaymentSection = () => (
        <Card 
            className="mb-4 shadow-3" 
            style={{ 
                backgroundColor: 'var(--surface-card)',
                border: `1px solid ${primaryColor}20`
            }}
        >
            <div className="p-6 text-center">
                {paymentProcessing ? (
                    <div>
                        <div 
                            className="flex align-items-center justify-content-center border-circle mx-auto mb-4"
                            style={{
                                backgroundColor: `${primaryColor}15`,
                                width: '80px',
                                height: '80px'
                            }}
                        >
                            <ProgressSpinner style={{ width: '40px', height: '40px' }} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: primaryColor }}>
                            Procesando pago...
                        </h3>
                        <div className="mb-4">
                            <div className="flex align-items-center justify-content-center gap-2 mb-2">
                                <i className="pi pi-shield" style={{ color: primaryColor }}></i>
                                <span className="text-600">Validando información...</span>
                            </div>
                            <div className="flex align-items-center justify-content-center gap-2 mb-2">
                                <i className="pi pi-credit-card" style={{ color: primaryColor }}></i>
                                <span className="text-600">Conectando con el procesador de pagos...</span>
                            </div>
                            <div className="flex align-items-center justify-content-center gap-2">
                                <i className="pi pi-check" style={{ color: primaryColor }}></i>
                                <span className="text-600">Finalizando transacción...</span>
                            </div>
                        </div>
                        {orderNumber && (
                            <div className="p-3 border-round mb-3" style={{ backgroundColor: `${primaryColor}10` }}>
                                <i className="pi pi-info-circle mr-2" style={{ color: primaryColor }}></i>
                                <strong>Orden:</strong> <span style={{ color: primaryColor }}>{orderNumber}</span>
                            </div>
                        )}
                        <div className="text-xs text-600 mt-3">
                            <i className="pi pi-clock mr-1"></i>
                            Procesando de forma segura - Puede tardar hasta 60 segundos
                        </div>
                    </div>
                ) : (
                    <div>
                        <div 
                            className="flex align-items-center justify-content-center border-circle mx-auto mb-4"
                            style={{
                                backgroundColor: `${primaryColor}15`,
                                color: primaryColor,
                                width: '80px',
                                height: '80px'
                            }}
                        >
                            <i className="pi pi-credit-card text-4xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: primaryColor }}>
                            Pago Seguro
                        </h3>
                        <p className="text-600 mb-4">
                            <i className="pi pi-lock mr-2"></i>
                            Tu pago será procesado de forma segura con encriptación SSL.
                        </p>
                        <div className="flex align-items-center justify-content-center gap-2 mb-4">
                            <i className="pi pi-shield text-green-500"></i>
                            <i className="pi pi-verified text-blue-500"></i>
                            <span className="text-600 text-sm">Pago 100% Seguro</span>
                        </div>
                        <Button
                            label={`Pagar ${cartService.formatPrice(cartSummary?.total || 0)}`}
                            icon="pi pi-credit-card"
                            className="p-3 text-lg font-bold shadow-3"
                            onClick={handleProcessCheckout}
                            disabled={processing}
                            style={{
                                backgroundColor: primaryColor,
                                borderColor: primaryColor,
                                minWidth: '250px',
                                minHeight: '50px'
                            }}
                        />
                        <div className="text-xs text-600 mt-3">
                            <i className="pi pi-info-circle mr-1"></i>
                            Proceso seguro - El tiempo puede variar según la conexión
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );

    const getNextButtonLabel = () => {
        switch (currentStep) {
            case 0: return 'Continuar a revisión';
            case 1: return 'Continuar al pago';
            default: return 'Continuar';
        }
    };

    const canProceedToNext = () => {
        switch (currentStep) {
            case 0: return clienteFormValid;
            case 1: return true;
            default: return false;
        }
    };

    const handleNext = () => {
        if (currentStep === 1) {
            handleProcessCheckout();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    return (
        <>
            <Toast ref={toast} />
            
            {!mounted ? (
                <div className="min-h-screen flex align-items-center justify-content-center">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                </div>
            ) : (
                <div 
                    className="min-h-screen pt-4 pb-6"
                    style={{ backgroundColor: 'var(--surface-ground)' }}
                >
                    <div className="container mx-auto px-4 max-w-6xl">
                        {/* Header mejorado */}
                        <div className="mb-6">
                            <div className="flex align-items-center mb-4">
                                <div 
                                    className="flex align-items-center justify-content-center border-circle mr-4"
                                    style={{
                                        backgroundColor: `${primaryColor}15`,
                                        color: primaryColor,
                                        width: '60px',
                                        height: '60px'
                                    }}
                                >
                                    <i className="pi pi-shopping-cart text-2xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>
                                        Finalizar Compra
                                    </h1>
                                    <p className="text-600 m-0">
                                        <i className="pi pi-shield mr-2"></i>
                                        Proceso seguro y protegido
                                    </p>
                                </div>
                            </div>
                            
                            {/* Pasos */}
                            <Steps 
                                model={steps} 
                                activeIndex={currentStep}
                                className="mb-4"
                            />
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                            </div>
                        ) : (
                            <div className="grid">
                                <div className="col-12 lg:col-8">
                                    {currentStep === 0 && renderClienteForm()}
                                    {currentStep === 1 && renderCartReview()}
                                    {currentStep === 2 && renderPaymentSection()}
                                    {currentStep === 3 && (
                                        <Card 
                                            className="shadow-4" 
                                            style={{ 
                                                backgroundColor: 'var(--surface-card)',
                                                border: `2px solid ${primaryColor}40`
                                            }}
                                        >
                                            <div className="text-center p-6">
                                                <div 
                                                    className="flex align-items-center justify-content-center border-circle mx-auto mb-4"
                                                    style={{
                                                        backgroundColor: '#10b98120',
                                                        color: '#10b981',
                                                        width: '100px',
                                                        height: '100px'
                                                    }}
                                                >
                                                    <i className="pi pi-check-circle text-6xl"></i>
                                                </div>
                                                <h3 className="text-3xl font-bold mb-3 text-900">¡Pago Exitoso!</h3>
                                                <p className="text-600 mb-4 text-lg">
                                                    Tu orden ha sido procesada correctamente.
                                                </p>
                                                {orderNumber && (
                                                    <div className="p-4 border-round mb-4" style={{ backgroundColor: `${primaryColor}10` }}>
                                                        <i className="pi pi-tag mr-2" style={{ color: primaryColor }}></i>
                                                        <strong>Número de orden:</strong> 
                                                        <span className="font-bold ml-2" style={{ color: primaryColor }}>
                                                            {orderNumber}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    )}
                                </div>
                                
                                <div className="col-12 lg:col-4">
                                    {cartSummary && (
                                        <Card 
                                            className="sticky top-4 shadow-3"
                                            style={{ 
                                                backgroundColor: 'var(--surface-card)',
                                                border: `1px solid ${primaryColor}20`
                                            }}
                                        >
                                            <div className="p-4">
                                                <div className="flex align-items-center justify-content-between mb-4">
                                                    <h4 className="font-bold m-0" style={{ color: primaryColor }}>
                                                        <i className="pi pi-wallet mr-2"></i>
                                                        Total del pedido
                                                    </h4>
                                                    <Badge 
                                                        value={cartSummary.totalItems} 
                                                        severity="success"
                                                        style={{ backgroundColor: primaryColor }}
                                                    />
                                                </div>
                                                <div className="text-center p-3 border-round mb-3" style={{ backgroundColor: `${primaryColor}08` }}>
                                                    <div className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
                                                        {cartService.formatPrice(cartSummary.total)}
                                                    </div>
                                                    <div className="text-sm text-600">
                                                        <i className="pi pi-box mr-1"></i>
                                                        {cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'producto' : 'productos'}
                                                    </div>
                                                </div>
                                                {currentStep < 2 && (
                                                    <div className="text-center">
                                                        <i className="pi pi-shield text-2xl" style={{ color: primaryColor }}></i>
                                                        <p className="text-600 text-sm mt-2">
                                                            Compra 100% segura
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Botones de navegación mejorados */}
                        <div className="flex justify-content-between mt-6">
                            <Button
                                label={currentStep === 0 ? "Volver al carrito" : "Atrás"}
                                icon="pi pi-arrow-left"
                                className="p-button-outlined p-3 shadow-2"
                                onClick={() => {
                                    if (currentStep === 0) {
                                        router.push('/cart');
                                    } else {
                                        setCurrentStep(currentStep - 1);
                                    }
                                }}
                                disabled={processing || currentStep >= 2}
                                style={{
                                    borderColor: primaryColor,
                                    color: primaryColor
                                }}
                            />
                            
                            {currentStep < 2 && (
                                <Button
                                    label={getNextButtonLabel()}
                                    icon="pi pi-arrow-right"
                                    iconPos="right"
                                    className="p-3 shadow-2"
                                    onClick={handleNext}
                                    disabled={processing || !canProceedToNext()}
                                    style={{
                                        backgroundColor: primaryColor,
                                        borderColor: primaryColor
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Dialog de éxito mejorado */}
                    <Dialog
                        header={
                            <div className="flex align-items-center">
                                <i className="pi pi-check-circle mr-2 text-green-500"></i>
                                ¡Compra realizada con éxito!
                            </div>
                        }
                        visible={showSuccessDialog}
                        onHide={handleSuccessDialogClose}
                        style={{ width: '500px' }}
                        modal
                        closable={false}
                    >
                        <div className="text-center p-4">
                            <div 
                                className="flex align-items-center justify-content-center border-circle mx-auto mb-4"
                                style={{
                                    backgroundColor: '#10b98120',
                                    color: '#10b981',
                                    width: '80px',
                                    height: '80px'
                                }}
                            >
                                <i className="pi pi-gift text-4xl"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-3">¡Gracias por tu compra!</h3>
                            <p className="text-600 mb-4">
                                Tu orden ha sido procesada exitosamente. Recibirás un correo de confirmación en breve.
                            </p>
                            {orderNumber && (
                                <div className="p-3 border-round-lg mb-4" style={{ backgroundColor: `${primaryColor}10` }}>
                                    <i className="pi pi-tag mr-2" style={{ color: primaryColor }}></i>
                                    <strong>Número de orden: </strong>
                                    <span className="font-bold" style={{ color: primaryColor }}>{orderNumber}</span>
                                </div>
                            )}
                            {paymentResult?.data?.isSimulated && (
                                <div className="p-3 border-round-lg mb-4" style={{ backgroundColor: '#f59e0b10' }}>
                                    <small className="text-orange-500">
                                        <i className="pi pi-info-circle mr-1"></i>
                                        Pago simulado (modo desarrollo)
                                    </small>
                                </div>
                            )}
                            <div className="flex gap-3 justify-content-center">
                                <Button
                                    label="Seguir comprando"
                                    icon="pi pi-shopping-bag"
                                    className="p-button-outlined"
                                    onClick={() => {
                                        setShowSuccessDialog(false);
                                        router.push('/products');
                                    }}
                                    style={{
                                        borderColor: primaryColor,
                                        color: primaryColor
                                    }}
                                />
                                <Button
                                    label="Ir al inicio"
                                    icon="pi pi-home"
                                    onClick={handleSuccessDialogClose}
                                    style={{
                                        backgroundColor: primaryColor,
                                        borderColor: primaryColor
                                    }}
                                />
                            </div>
                        </div>
                    </Dialog>
                </div>
            )}
        </>
    );
};

export default CheckoutPage;