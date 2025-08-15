// services/ventasService.ts - VERSIÓN CORREGIDA

const API_BASE_URL = process.env.NEXT_PUBLIC_VENTAS_API_URL || 'http://localhost:8083';

// =====================================
// INTERFACES PARA VENTAS
// =====================================

export interface VentaItemRequest {
    productoId: number;
    cantidad: number;
}

export interface VentaRequest {
    clienteId: number;
    items: VentaItemRequest[];
}

export interface ClienteResponse {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
}

export interface DetalleVentaResponse {
    id: number;
    productoId: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface VentaResponse {
    id: number;
    numeroFactura: string;
    cliente: ClienteResponse;
    subtotal: number;
    impuesto: number;
    total: number;
    estado: string;
    fechaVenta: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    detalles: DetalleVentaResponse[];
}

// =====================================
// INTERFACE GENÉRICA PARA RESPUESTAS
// =====================================
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

class VentasService {
    
    // =====================================
    // MÉTODOS AUXILIARES
    // =====================================
    
    private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_BASE_URL}${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                let errorMessage = `Error ${response.status}`;
                
                try {
                    const errorData = await response.text();
                    if (errorData) {
                        errorMessage += `: ${errorData}`;
                    }
                } catch (parseError) {
                    errorMessage += ': Error desconocido';
                }
                
                return {
                    success: false,
                    message: errorMessage,
                };
            }

            // Si es PUT/DELETE y no hay contenido, retornar éxito
            if (response.status === 204 || response.status === 200) {
                try {
                    const data = await response.json();
                    return {
                        success: true,
                        message: 'Operación exitosa',
                        data,
                    };
                } catch {
                    // Si no hay JSON, retornar éxito sin data
                    return {
                        success: true,
                        message: 'Operación exitosa',
                    };
                }
            }

            const data = await response.json();
            return {
                success: true,
                message: 'Operación exitosa',
                data,
            };
        } catch (error: any) {
            console.error('Error en la petición:', error);
            return {
                success: false,
                message: error.message || 'Error de conexión con el servidor',
            };
        }
    }

    // =====================================
    // MÉTODOS PARA VENTAS
    // =====================================
    
    /**
     * Crear una nueva venta
     */
    async crearVenta(venta: VentaRequest): Promise<ApiResponse<VentaResponse>> {
        console.log('📝 Creando venta:', venta);
        return this.makeRequest<VentaResponse>('/api/ventas', {
            method: 'POST',
            body: JSON.stringify(venta),
        });
    }

    /**
     * Obtener una venta por ID
     */
    async obtenerVentaPorId(id: number): Promise<ApiResponse<VentaResponse>> {
        console.log('🔍 Obteniendo venta por ID:', id);
        return this.makeRequest<VentaResponse>(`/api/ventas/${id}`);
    }

    /**
     * Obtener una venta por número de factura
     */
    async obtenerVentaPorFactura(numeroFactura: string): Promise<ApiResponse<VentaResponse>> {
        console.log('🔍 Obteniendo venta por factura:', numeroFactura);
        return this.makeRequest<VentaResponse>(`/api/ventas/factura/${encodeURIComponent(numeroFactura)}`);
    }

    /**
     * Listar todas las ventas
     */
    async listarVentas(): Promise<ApiResponse<VentaResponse[]>> {
        console.log('📋 Listando ventas...');
        return this.makeRequest<VentaResponse[]>('/api/ventas');
    }

    /**
     * Listar ventas por cliente
     */
    async listarVentasPorCliente(clienteId: number): Promise<ApiResponse<VentaResponse[]>> {
        console.log('📋 Listando ventas por cliente:', clienteId);
        return this.makeRequest<VentaResponse[]>(`/api/ventas/cliente/${clienteId}`);
    }

    /**
     * Completar una venta (cambiar estado a COMPLETADA)
     */
    async completarVenta(id: number): Promise<ApiResponse<VentaResponse>> {
        console.log('✅ Completando venta:', id);
        
        try {
            const response = await this.makeRequest<VentaResponse>(`/api/ventas/${id}/completar`, {
                method: 'PUT',
            });
            
            if (response.success) {
                console.log('✅ Venta completada exitosamente');
            } else {
                console.error('❌ Error completando venta:', response.message);
            }
            
            return response;
        } catch (error: any) {
            console.error('❌ Error en completarVenta:', error);
            return {
                success: false,
                message: error.message || 'Error completando la venta'
            };
        }
    }

    /**
     * Cancelar una venta (cambiar estado a CANCELADA)
     */
    async cancelarVenta(id: number): Promise<ApiResponse<VentaResponse>> {
        console.log('❌ Cancelando venta:', id);
        
        try {
            const response = await this.makeRequest<VentaResponse>(`/api/ventas/${id}/cancelar`, {
                method: 'PUT',
            });
            
            if (response.success) {
                console.log('✅ Venta cancelada exitosamente');
            } else {
                console.error('❌ Error cancelando venta:', response.message);
            }
            
            return response;
        } catch (error: any) {
            console.error('❌ Error en cancelarVenta:', error);
            return {
                success: false,
                message: error.message || 'Error cancelando la venta'
            };
        }
    }

    // =====================================
    // MÉTODOS AUXILIARES DE FORMATO
    // =====================================
    
    /**
     * Formatear fecha
     */
    formatearFecha(fecha: string): string {
        try {
            if (!fecha) return 'Fecha no disponible';
            const date = new Date(fecha);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return 'Fecha inválida';
        }
    }

    /**
     * Formatear precio
     */
    formatearPrecio(precio: number): string {
        if (typeof precio !== 'number' || isNaN(precio)) {
            return '$0.00';
        }
        
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD'
        }).format(precio);
    }

    /**
     * Obtener color del estado (para PrimeReact Badge)
     */
    obtenerColorEstado(estado: string): "success" | "warning" | "danger" | "info" {
        if (!estado) return 'info';
        
        switch (estado.toUpperCase()) {
            case 'COMPLETADA':
            case 'COMPLETED':
                return 'success';
            case 'PENDIENTE':
            case 'PENDING':
                return 'warning';
            case 'CANCELADA':
            case 'CANCELLED':
            case 'CANCELED':
                return 'danger';
            default:
                return 'info';
        }
    }

    /**
     * Obtener icono del estado
     */
    obtenerIconoEstado(estado: string): string {
        if (!estado) return 'pi pi-info-circle';
        
        switch (estado.toUpperCase()) {
            case 'COMPLETADA':
            case 'COMPLETED':
                return 'pi pi-check-circle';
            case 'PENDIENTE':
            case 'PENDING':
                return 'pi pi-clock';
            case 'CANCELADA':
            case 'CANCELLED':
            case 'CANCELED':
                return 'pi pi-times-circle';
            default:
                return 'pi pi-info-circle';
        }
    }

    /**
     * Formatear estado para mostrar
     */
    formatearEstado(estado: string): string {
        if (!estado) return 'Desconocido';
        
        switch (estado.toUpperCase()) {
            case 'COMPLETADA':
            case 'COMPLETED':
                return 'Completada';
            case 'PENDIENTE':
            case 'PENDING':
                return 'Pendiente';
            case 'CANCELADA':
            case 'CANCELLED':
            case 'CANCELED':
                return 'Cancelada';
            default:
                return estado;
        }
    }

    /**
     * Verificar si una venta puede ser completada
     */
    puedeCompletarse(venta: VentaResponse): boolean {
        if (!venta || !venta.estado) return false;
        return venta.estado.toUpperCase() === 'PENDIENTE' || venta.estado.toUpperCase() === 'PENDING';
    }

    /**
     * Verificar si una venta puede ser cancelada
     */
    puedeCancelarse(venta: VentaResponse): boolean {
        if (!venta || !venta.estado) return false;
        const estado = venta.estado.toUpperCase();
        return estado === 'PENDIENTE' || estado === 'PENDING';
    }
}

// Exportar una instancia única del servicio
const ventasService = new VentasService();
export default ventasService;   