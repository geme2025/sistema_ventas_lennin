import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

// Tipos para el sistema de ventas
export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string | null;
    estado: boolean;
    created_at: string;
    updated_at: string;
}

export interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    categoria_id: number;
    categoria?: Categoria;
    precio_compra: number;
    precio_venta: number;
    stock: number;
    stock_minimo: number;
    imagen: string | null;
    estado: boolean;
    created_at: string;
    updated_at: string;
}

export interface Cliente {
    id: number;
    tipo_documento: string;
    numero_documento: string;
    nombres: string;
    apellidos: string;
    telefono: string | null;
    email: string | null;
    direccion: string | null;
    estado: boolean;
    created_at: string;
    updated_at: string;
}

export interface DetalleVenta {
    id: number;
    venta_id: number;
    producto_id: number;
    producto?: Producto;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
    subtotal: number;
}

export interface Venta {
    id: number;
    numero_venta: string;
    cliente_id: number | null;
    cliente?: Cliente | null;
    user_id: number;
    user?: User;
    fecha_venta: string;
    subtotal: number;
    igv: number;
    total: number;
    metodo_pago: 'efectivo' | 'tarjeta' | 'yape' | 'plin' | 'transferencia';
    estado: 'pendiente' | 'completada' | 'anulada';
    observaciones: string | null;
    detalles?: DetalleVenta[];
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface DetalleVentaInput {
    producto_id: number;
    producto?: Producto;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
    subtotal: number;
}
