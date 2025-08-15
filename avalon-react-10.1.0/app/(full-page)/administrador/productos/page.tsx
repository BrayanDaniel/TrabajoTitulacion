'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Image } from 'primereact/image';
import { Skeleton } from 'primereact/skeleton';
import { Toolbar } from 'primereact/toolbar';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import emprendedorService, { ProductoEmprendedor, Categoria, Empresa } from '../../../../services/emprendedorService';

const ProductosPage: React.FC = () => {
    const router = useRouter();
    const toast = useRef<Toast>(null);

    // Estados principales
    const [productos, setProductos] = useState<ProductoEmprendedor[]>([]);
    const [productosFiltrados, setProductosFiltrados] = useState<ProductoEmprendedor[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Estados para el modal de detalles
    const [selectedProducto, setSelectedProducto] = useState<ProductoEmprendedor | null>(null);
    const [productDetailVisible, setProductDetailVisible] = useState(false);

    // ✅ FUNCIÓN PARA FORMATEAR FECHAS
    const formatearFecha = (fecha: string): string => {
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
    };

    // Cargar datos iniciales
    useEffect(() => {
        cargarDatos();
        
        // ✅ ESCUCHAR EVENTOS DE ACTUALIZACIÓN DE STOCK
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

    const cargarDatos = async () => {
        setLoading(true);
        try {
            console.log('🔄 Cargando datos del panel de emprendedor...');

            // Cargar productos, categorías y empresas en paralelo
            const [productosRes, categoriasRes, empresasRes] = await Promise.all([
                emprendedorService.obtenerProductosEmprendedor(),
                emprendedorService.obtenerCategorias(),
                emprendedorService.obtenerEmpresas()
            ]);

            if (productosRes.success && productosRes.data) {
                // ✅ NORMALIZAR DATOS para evitar valores null/undefined
                const productosNormalizados = productosRes.data.map(producto => ({
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
                    inventario: producto.inventario || { id: 0, cantidad: 0, ubicacion: 'Sin stock' }
                }));
                
                setProductos(productosNormalizados);
                setProductosFiltrados(productosNormalizados);
                console.log('✅ Productos cargados:', productosNormalizados.length);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: productosRes.message || 'Error cargando productos',
                    life: 3000
                });
            }

            if (categoriasRes.success && categoriasRes.data) {
                setCategorias(categoriasRes.data);
            }

            if (empresasRes.success && empresasRes.data) {
                setEmpresas(empresasRes.data);
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

    // ✅ FUNCIÓN DE FILTRO MANUAL (más segura)
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

    // Confirmar eliminación
    const confirmarEliminacion = (producto: ProductoEmprendedor) => {
        confirmDialog({
            message: `¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => eliminarProducto(producto.id)
        });
    };

    // Eliminar producto
    const eliminarProducto = async (id: number) => {
        try {
            const response = await emprendedorService.eliminarProducto(id);
            
            if (response.success) {
                const updatedProducts = productos.filter(p => p.id !== id);
                setProductos(updatedProducts);
                setProductosFiltrados(updatedProducts);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: response.message,
                    life: 3000
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: response.message,
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
    };

    // Ver detalles del producto
    const verDetalles = (producto: ProductoEmprendedor) => {
        setSelectedProducto(producto);
        setProductDetailVisible(true);
    };

    // Templates para las columnas
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

    const priceBodyTemplate = (rowData: ProductoEmprendedor) => {
        return (
            <span className="font-bold text-primary">
                {emprendedorService.formatearPrecio(rowData.precio)}
            </span>
        );
    };

    const statusBodyTemplate = (rowData: ProductoEmprendedor) => {
        return (
            <Badge 
                value={rowData.activo ? 'Activo' : 'Inactivo'} 
                severity={rowData.activo ? 'success' : 'danger'}
            />
        );
    };

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

    const actionBodyTemplate = (rowData: ProductoEmprendedor) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-eye" 
                    className="p-button-rounded p-button-info p-button-sm" 
                    onClick={() => verDetalles(rowData)}
                    tooltip="Ver detalles"
                />
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-success p-button-sm" 
                    onClick={() => router.push(`/emprendedor/productos/${rowData.id}/editar`)}
                    tooltip="Editar"
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger p-button-sm" 
                    onClick={() => confirmarEliminacion(rowData)}
                    tooltip="Eliminar"
                />
            </div>
        );
    };

    // Toolbar del listado
    const leftToolbarTemplate = () => {
        return (
            <div className="flex align-items-center gap-2">
                <Button 
                    label="Nuevo Producto" 
                    icon="pi pi-plus" 
                    className="p-button-success"
                    onClick={() => router.push('/emprendedor/productos/crear')}
                />
                <Button 
                    label="Actualizar" 
                    icon="pi pi-refresh" 
                    className="p-button-outlined"
                    onClick={cargarDatos}
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
                        placeholder="Buscar productos..." 
                        className="w-20rem"
                    />
                </span>
            </div>
        );
    };

    // Renderizar esqueleto mientras carga
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
        <div className="emprendedor-productos">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Header */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold text-900 mb-2">
                    <i className="pi pi-box text-primary mr-3"></i>
                    Gestión de Productos
                </h1>
                <p className="text-600 text-lg">
                    Administra el catálogo de productos de tu negocio
                </p>
            </div>

            {/* Contenido principal */}
            <Card>
                <Toolbar 
                    className="mb-4" 
                    left={leftToolbarTemplate} 
                    right={rightToolbarTemplate}
                />

                {loading ? (
                    renderSkeleton()
                ) : (
                    <DataTable 
                        value={productosFiltrados}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        emptyMessage="No se encontraron productos"
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
                            header="Nombre" 
                            sortable 
                            className="font-bold"
                        />
                        <Column 
                            field="categoria.nombre" 
                            header="Categoría" 
                            sortable
                        />
                        <Column 
                            field="empresa.nombre" 
                            header="Empresa" 
                            sortable
                        />
                        <Column 
                            field="precio" 
                            header="Precio" 
                            body={priceBodyTemplate} 
                            sortable
                        />
                        <Column 
                            field="inventario.cantidad" 
                            header="Stock" 
                            body={stockBodyTemplate}
                            sortable
                        />
                        <Column 
                            field="activo" 
                            header="Estado" 
                            body={statusBodyTemplate} 
                            sortable
                        />
                        <Column 
                            body={actionBodyTemplate} 
                            header="Acciones"
                            style={{ width: '150px' }}
                            sortable={false}
                        />
                    </DataTable>
                )}
            </Card>

            {/* Modal de detalles del producto */}
            <Dialog
                header="Detalles del Producto"
                visible={productDetailVisible}
                style={{ width: '600px' }}
                modal
                onHide={() => setProductDetailVisible(false)}
            >
                {selectedProducto && (
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <Image
                                src={selectedProducto.imagen || 'https://via.placeholder.com/300x300?text=Producto'}
                                alt={selectedProducto.nombre}
                                width="100%"
                                className="border-round-lg shadow-2"
                                preview
                            />
                        </div>
                        <div className="col-12 md:col-8">
                            <h3 className="text-2xl font-bold text-900 mb-3">
                                {selectedProducto.nombre}
                            </h3>
                            
                            <div className="mb-3">
                                <strong>Descripción:</strong>
                                <p className="mt-1 text-600">{selectedProducto.descripcion}</p>
                            </div>
                            
                            <div className="grid">
                                <div className="col-6">
                                    <strong>Precio:</strong>
                                    <div className="text-primary font-bold text-xl">
                                        {emprendedorService.formatearPrecio(selectedProducto.precio)}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <strong>Stock:</strong>
                                    <div className="font-bold">
                                        {selectedProducto.inventario?.cantidad || 0} unidades
                                    </div>
                                </div>
                                <div className="col-6">
                                    <strong>Categoría:</strong>
                                    <div>{selectedProducto.categoria.nombre}</div>
                                </div>
                                <div className="col-6">
                                    <strong>Empresa:</strong>
                                    <div>{selectedProducto.empresa.nombre}</div>
                                </div>
                                <div className="col-6">
                                    <strong>Estado:</strong>
                                    <div>
                                        <Badge 
                                            value={selectedProducto.activo ? 'Activo' : 'Inactivo'} 
                                            severity={selectedProducto.activo ? 'success' : 'danger'}
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <strong>Creado:</strong>
                                    <div className="text-600">
                                        {formatearFecha(selectedProducto.fechaCreacion)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default ProductosPage;