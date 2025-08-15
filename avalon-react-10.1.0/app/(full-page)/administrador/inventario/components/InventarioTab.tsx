'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Image } from 'primereact/image';
import { Skeleton } from 'primereact/skeleton';
import { Toolbar } from 'primereact/toolbar';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import emprendedorService, { ProductoEmprendedor } from '../../../../../services/emprendedorService';

interface InventarioTabProps {
    toast: React.RefObject<Toast>;
}

const InventarioTab: React.FC<InventarioTabProps> = ({ toast }) => {
    const router = useRouter();
    
    // ✅ USAR EXACTAMENTE LOS MISMOS ESTADOS QUE PRODUCTOS
    const [productos, setProductos] = useState<ProductoEmprendedor[]>([]);
    const [productosFiltrados, setProductosFiltrados] = useState<ProductoEmprendedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // ✅ USAR EXACTAMENTE LA MISMA LÓGICA DE CARGA QUE PRODUCTOS
    useEffect(() => {
        cargarDatos();
        
        // ✅ EXACTAMENTE EL MISMO LISTENER QUE PRODUCTOS
        const handleStockUpdate = (event: CustomEvent) => {
            const { productoId, stock } = event.detail;
            
            const updateProducts = (prevProductos: ProductoEmprendedor[]) => 
                prevProductos.map(producto => 
                    producto.id === productoId 
                        ? {
                            ...producto,
                            inventario: {
                                ...producto.inventario,
                                id: producto.inventario?.id || 0,
                                cantidad: stock,
                                ubicacion: stock > 0 ? 'Disponible' : 'No disponible'
                            }
                        }
                        : producto
                );
            
            setProductos(updateProducts);
            setProductosFiltrados(updateProducts);
        };

        window.addEventListener('stockUpdatedEmprendedor', handleStockUpdate as EventListener);
        
        return () => {
            window.removeEventListener('stockUpdatedEmprendedor', handleStockUpdate as EventListener);
        };
    }, []);

    // ✅ EXACTAMENTE LA MISMA FUNCIÓN cargarDatos QUE PRODUCTOS (SIN ACTUALIZACIÓN EN SEGUNDO PLANO)
    const cargarDatos = async () => {
        setLoading(true);
        try {
            console.log('🔄 Cargando datos del inventario (usando lógica de productos SIN actualización segundo plano)...');

            // ✅ USAR LA MISMA LLAMADA QUE PRODUCTOS
            const productosRes = await emprendedorService.obtenerProductosEmprendedor();

            if (productosRes.success && productosRes.data) {
                // ✅ LOG PARA VER QUE LLEGA ANTES DE NORMALIZAR
                console.log('🔍 Datos RAW de productos antes de normalizar:', productosRes.data.slice(0, 3).map(p => ({
                    id: p.id,
                    nombre: p.nombre,
                    inventario: p.inventario
                })));
                
                // ✅ EXACTAMENTE LA MISMA NORMALIZACIÓN QUE PRODUCTOS (SIN MODIFICAR INVENTARIO)
                const productosNormalizados = productosRes.data.map(producto => {
                    console.log(`🔍 Producto ${producto.nombre}: inventario original =`, producto.inventario);
                    
                    return {
                        ...producto,
                        nombre: producto.nombre || '',
                        descripcion: producto.descripcion || '',
                        categoria: {
                            ...producto.categoria,
                            nombre: producto.categoria?.nombre || 'Sin categoría'
                        },
                        empresa: {
                            ...producto.empresa,
                            nombre: producto.empresa?.nombre || 'Sin empresa'
                        },
                        // ✅ MANTENER INVENTARIO TAL COMO VIENE (NO CREAR UNO NUEVO)
                        inventario: producto.inventario || { id: 0, cantidad: 0, ubicacion: 'Sin stock' }
                    };
                });
                
                console.log('🔍 Productos normalizados:', productosNormalizados.slice(0, 3).map(p => ({
                    id: p.id,
                    nombre: p.nombre,
                    inventario: p.inventario
                })));
                
                setProductos(productosNormalizados);
                setProductosFiltrados(productosNormalizados);
                console.log('✅ Productos cargados en inventario (SIN actualización segundo plano):', productosNormalizados.length);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: productosRes.message || 'Error cargando productos',
                    life: 3000
                });
            }

        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error de conexión con el servidor',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ EXACTAMENTE LA MISMA FUNCIÓN DE FILTRO QUE PRODUCTOS
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        
        if (!value.trim()) {
            setProductosFiltrados(productos);
            return;
        }
        
        const filtered = productos.filter(producto => 
            producto.nombre?.toLowerCase().includes(value) ||
            producto.descripcion?.toLowerCase().includes(value) ||
            producto.categoria?.nombre?.toLowerCase().includes(value) ||
            producto.empresa?.nombre?.toLowerCase().includes(value)
        );
        
        setProductosFiltrados(filtered);
    };

    // ✅ EXACTAMENTE LOS MISMOS TEMPLATES QUE PRODUCTOS
    const imageBodyTemplate = (rowData: ProductoEmprendedor) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Image 
                    src={rowData.imagen || 'https://via.placeholder.com/60x60?text=Producto'} 
                    alt={rowData.nombre}
                    width="60" 
                    height="60"
                    className="border-round-lg shadow-2"
                    preview
                />
            </div>
        );
    };

    // ✅ EXACTAMENTE EL MISMO stockBodyTemplate QUE PRODUCTOS
    const stockBodyTemplate = (rowData: ProductoEmprendedor) => {
        const cantidad = rowData.inventario?.cantidad || 0;
        let severity: "success" | "warning" | "danger" = 'success';
        
        if (cantidad === 0) severity = 'danger';
        else if (cantidad <= 5) severity = 'warning';
        
        return (
            <div className="flex align-items-center gap-2">
                <Badge value={cantidad.toString()} severity={severity} />
                <span className="text-sm text-600">unidades</span>
            </div>
        );
    };

    const ubicacionBodyTemplate = (rowData: ProductoEmprendedor) => {
        const ubicacion = rowData.inventario?.ubicacion || 'Sin ubicación';
        const cantidad = rowData.inventario?.cantidad || 0;
        
        return (
            <span className={`text-sm ${cantidad > 0 ? 'text-600' : 'text-red-500'}`}>
                {ubicacion}
            </span>
        );
    };

    const actionBodyTemplate = (rowData: ProductoEmprendedor) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-warning p-button-sm" 
                    onClick={() => {
                        console.log('🔄 Navegando a editar inventario producto:', rowData.id);
                        router.push(`/emprendedor/inventario/${rowData.id}/editar`);
                    }}
                    tooltip="Editar inventario"
                />
                <Button 
                    icon="pi pi-plus" 
                    className="p-button-rounded p-button-success p-button-sm" 
                    onClick={() => {
                        console.log('🔄 Navegando a ajuste rápido producto:', rowData.id);
                        router.push(`/emprendedor/inventario/ajustar?producto=${rowData.id}`);
                    }}
                    tooltip="Ajuste rápido"
                />
            </div>
        );
    };

    // ✅ EXACTAMENTE LOS MISMOS TOOLBARS QUE PRODUCTOS
    const leftToolbarTemplate = () => {
        return (
            <div className="flex align-items-center gap-2">
                <Button 
                    label="Nuevo Inventario" 
                    icon="pi pi-plus" 
                    className="p-button-success"
                    onClick={() => router.push('/emprendedor/inventario/crear')}
                />
                <Button 
                    label="Actualizar" 
                    icon="pi pi-refresh" 
                    className="p-button-outlined"
                    onClick={cargarDatos}
                />
                <Button 
                    label="Ajuste Masivo" 
                    icon="pi pi-cog" 
                    className="p-button-warning"
                    onClick={() => router.push('/emprendedor/inventario/ajustar')}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex align-items-center gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText 
                        value={searchTerm} 
                        onChange={handleSearch}
                        placeholder="Buscar en inventario..." 
                        className="w-20rem"
                    />
                </span>
            </div>
        );
    };

    // ✅ EXACTAMENTE EL MISMO SKELETON QUE PRODUCTOS
    const renderSkeleton = () => (
        <div className="grid">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="col-12">
                    <Skeleton width="100%" height="4rem" className="mb-2" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="inventario-tab">
            {/* ✅ ESTADÍSTICAS RÁPIDAS */}
            <div className="grid mb-4">
                <div className="col-12 md:col-3">
                    <div className="bg-blue-50 border-round p-3 text-center">
                        <div className="text-blue-600 font-bold text-xl">
                            {productos.length}
                        </div>
                        <div className="text-600 text-sm">Total Productos</div>
                    </div>
                </div>
                <div className="col-12 md:col-3">
                    <div className="bg-green-50 border-round p-3 text-center">
                        <div className="text-green-600 font-bold text-xl">
                            {productos.filter(p => {
                                const stock = p.inventario?.cantidad || 0;
                                return stock > 5;
                            }).length}
                        </div>
                        <div className="text-600 text-sm">Stock Suficiente</div>
                    </div>
                </div>
                <div className="col-12 md:col-3">
                    <div className="bg-orange-50 border-round p-3 text-center">
                        <div className="text-orange-600 font-bold text-xl">
                            {productos.filter(p => {
                                const stock = p.inventario?.cantidad || 0;
                                return stock > 0 && stock <= 5;
                            }).length}
                        </div>
                        <div className="text-600 text-sm">Stock Bajo</div>
                    </div>
                </div>
                <div className="col-12 md:col-3">
                    <div className="bg-red-50 border-round p-3 text-center">
                        <div className="text-red-600 font-bold text-xl">
                            {productos.filter(p => {
                                const stock = p.inventario?.cantidad || 0;
                                return stock === 0;
                            }).length}
                        </div>
                        <div className="text-600 text-sm">Sin Stock</div>
                    </div>
                </div>
            </div>

            {/* ✅ TOOLBAR */}
            <Toolbar 
                className="mb-4" 
                left={leftToolbarTemplate} 
                right={rightToolbarTemplate}
            />

            {/* ✅ TABLA DE INVENTARIO - EXACTAMENTE IGUAL QUE PRODUCTOS */}
            {loading ? (
                renderSkeleton()
            ) : (
                <DataTable 
                    value={productosFiltrados}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    emptyMessage="No se encontraron productos en inventario"
                    responsiveLayout="scroll"
                    className="p-datatable-sm"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
                >
                    <Column 
                        field="imagen" 
                        header="Imagen" 
                        body={imageBodyTemplate} 
                        style={{ width: '100px' }}
                        sortable={false}
                    />
                    <Column 
                        field="nombre" 
                        header="Producto" 
                        sortable 
                        className="font-bold"
                    />
                    <Column 
                        field="categoria.nombre" 
                        header="Categoría" 
                        sortable
                    />
                    <Column 
                        field="inventario.cantidad" 
                        header="Stock Actual" 
                        body={stockBodyTemplate}
                        sortable
                    />
                    <Column 
                        field="inventario.ubicacion" 
                        header="Ubicación/Estado" 
                        body={ubicacionBodyTemplate}
                        sortable
                    />
                    <Column 
                        body={actionBodyTemplate} 
                        header="Acciones"
                        style={{ width: '120px' }}
                        sortable={false}
                    />
                </DataTable>
            )}
        </div>
    );
};

export default InventarioTab;