import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Venta, type Producto } from '@/types';
import { Head } from '@inertiajs/react';
import {
    TrendingUp,
    ShoppingCart,
    Users,
    Package,
    AlertTriangle,
    Clock,
    DollarSign,
    Calendar
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Estadisticas {
    ventas_hoy: number;
    ventas_mes: number;
    productos_bajo_stock: number;
    total_clientes: number;
    total_productos: number;
    ventas_pendientes: number;
}

interface ProductoVendido {
    producto_id: number;
    total_vendido: number;
    producto: Producto & {
        categoria: { id: number; nombre: string };
    };
}

interface DashboardProps {
    estadisticas: Estadisticas;
    ultimas_ventas: Venta[];
    productos_mas_vendidos: ProductoVendido[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(value);
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

export default function Dashboard({ estadisticas, ultimas_ventas, productos_mas_vendidos }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Título */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Bienvenido al sistema de ventas LENNIN S.A.C</p>
                </div>

                {/* Tarjetas de estadísticas principales */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Ventas Hoy</p>
                                <p className="text-2xl font-bold">{formatCurrency(estadisticas.ventas_hoy)}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Ventas del Mes</p>
                                <p className="text-2xl font-bold">{formatCurrency(estadisticas.ventas_mes)}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Clientes Activos</p>
                                <p className="text-2xl font-bold">{estadisticas.total_clientes}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Productos</p>
                                <p className="text-2xl font-bold">{estadisticas.total_productos}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                                <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertas */}
                <div className="grid gap-4 md:grid-cols-2">
                    {estadisticas.productos_bajo_stock > 0 && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-950/20">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                                <div>
                                    <p className="font-medium text-yellow-900 dark:text-yellow-100">Stock Bajo</p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        {estadisticas.productos_bajo_stock} producto(s) con stock bajo
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {estadisticas.ventas_pendientes > 0 && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                                <div>
                                    <p className="font-medium text-blue-900 dark:text-blue-100">Ventas Pendientes</p>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        {estadisticas.ventas_pendientes} venta(s) pendiente(s) de confirmar
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Secciones inferiores */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Últimas ventas */}
                    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                        <div className="border-b bg-muted/50 p-4">
                            <h3 className="flex items-center gap-2 font-semibold">
                                <ShoppingCart className="h-5 w-5" />
                                Últimas Ventas
                            </h3>
                        </div>
                        <div className="p-4">
                            {ultimas_ventas.length > 0 ? (
                                <div className="space-y-3">
                                    {ultimas_ventas.map((venta) => (
                                        <div
                                            key={venta.id}
                                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{venta.numero_venta}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {venta.cliente?.nombres} {venta.cliente?.apellidos || 'Sin cliente'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    <Calendar className="inline h-3 w-3" /> {formatDate(venta.created_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(venta.total)}
                                                </p>
                                                <span
                                                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                        venta.estado === 'completada'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                                                            : venta.estado === 'pendiente'
                                                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                    }`}
                                                >
                                                    {venta.estado}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No hay ventas recientes
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Productos más vendidos */}
                    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                        <div className="border-b bg-muted/50 p-4">
                            <h3 className="flex items-center gap-2 font-semibold">
                                <Package className="h-5 w-5" />
                                Productos Más Vendidos
                            </h3>
                        </div>
                        <div className="p-4">
                            {productos_mas_vendidos.length > 0 ? (
                                <div className="space-y-3">
                                    {productos_mas_vendidos.map((item, index) => (
                                        <div
                                            key={item.producto_id}
                                            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{item.producto.nombre}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.producto.categoria?.nombre}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{item.total_vendido}</p>
                                                <p className="text-xs text-muted-foreground">unidades</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No hay datos de ventas
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

