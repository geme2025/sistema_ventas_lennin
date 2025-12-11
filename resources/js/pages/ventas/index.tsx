import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, Ban, Receipt, Calendar, User } from 'lucide-react';
import { useState } from 'react';

import { DataTable, EmptyState } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Venta, type PaginatedData } from '@/types';

interface Props {
    ventas: PaginatedData<Venta>;
    filters: {
        search?: string;
        per_page?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ventas', href: '/ventas' },
];

const estadoColors: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    completada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    anulada: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const metodoPagoLabels: Record<string, string> = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    yape: 'Yape',
    plin: 'Plin',
};

export default function VentasIndex({ ventas, filters }: Props) {
    const [anularDialog, setAnularDialog] = useState<{ open: boolean; venta: Venta | null }>({
        open: false,
        venta: null,
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAnular = () => {
        if (!anularDialog.venta) return;

        setIsProcessing(true);
        router.post(`/ventas/${anularDialog.venta.id}/anular`, {}, {
            onSuccess: () => {
                setAnularDialog({ open: false, venta: null });
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const columns = [
        {
            key: 'numero_venta',
            label: 'N° Venta',
            render: (venta: Venta) => (
                <div>
                    <p className="font-mono font-semibold text-primary">{venta.numero_venta}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(venta.fecha_venta)}
                    </div>
                </div>
            ),
        },
        {
            key: 'cliente',
            label: 'Cliente',
            render: (venta: Venta) => (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium">
                            {venta.cliente ? `${venta.cliente.nombres} ${venta.cliente.apellidos}` : 'Cliente General'}
                        </p>
                        {venta.cliente && (
                            <p className="text-xs text-muted-foreground">
                                {venta.cliente.tipo_documento}: {venta.cliente.numero_documento}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'metodo_pago',
            label: 'Método de Pago',
            render: (venta: Venta) => (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30">
                    {metodoPagoLabels[venta.metodo_pago] || venta.metodo_pago}
                </span>
            ),
        },
        {
            key: 'total',
            label: 'Total',
            render: (venta: Venta) => (
                <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(Number(venta.total))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        IGV: {formatCurrency(Number(venta.igv))}
                    </p>
                </div>
            ),
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (venta: Venta) => (
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${estadoColors[venta.estado]}`}>
                    {venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
                </span>
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (venta: Venta) => (
                <div className="flex items-center gap-2">
                    <Link href={`/ventas/${venta.id}`}>
                        <Button variant="ghost" size="icon" title="Ver detalles">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    {venta.estado === 'completada' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Anular venta"
                            onClick={() => setAnularDialog({ open: true, venta })}
                        >
                            <Ban className="h-4 w-4 text-red-500" />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ventas" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Ventas</h1>
                        <p className="text-muted-foreground">
                            Gestiona las ventas de la juguetería LENNIN S.A.C.
                        </p>
                    </div>
                    <Link href="/ventas/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Venta
                        </Button>
                    </Link>
                </div>

                {/* Resumen rápido */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Total Ventas</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{ventas.total}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                            <span className="text-sm text-muted-foreground">Completadas</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-green-600">
                            {ventas.data.filter(v => v.estado === 'completada').length}
                        </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                            <span className="text-sm text-muted-foreground">Pendientes</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-yellow-600">
                            {ventas.data.filter(v => v.estado === 'pendiente').length}
                        </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                            <span className="text-sm text-muted-foreground">Anuladas</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-red-600">
                            {ventas.data.filter(v => v.estado === 'anulada').length}
                        </p>
                    </div>
                </div>

                {ventas.data.length > 0 || filters.search ? (
                    <DataTable
                        data={ventas.data}
                        columns={columns}
                        pagination={{
                            currentPage: ventas.current_page,
                            lastPage: ventas.last_page,
                            perPage: ventas.per_page,
                            total: ventas.total,
                            from: ventas.from,
                            to: ventas.to,
                        }}
                        searchValue={filters.search || ''}
                        searchPlaceholder="Buscar por número de venta, cliente..."
                        baseUrl="/ventas"
                        perPageOptions={[10, 25, 50, 100]}
                    />
                ) : (
                    <EmptyState
                        title="Sin ventas"
                        description="Aún no hay ventas registradas. Comienza realizando la primera venta."
                        actionLabel="Nueva Venta"
                        actionHref="/ventas/create"
                    />
                )}
            </div>

            {/* Dialog de confirmación de anulación */}
            <Dialog open={anularDialog.open} onOpenChange={(open) => setAnularDialog({ open, venta: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Anular venta?</DialogTitle>
                        <DialogDescription>
                            Esta acción anulará la venta <strong>{anularDialog.venta?.numero_venta}</strong> y
                            restaurará el stock de los productos. Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAnularDialog({ open: false, venta: null })}
                            disabled={isProcessing}
                        >
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleAnular} disabled={isProcessing}>
                            {isProcessing ? 'Anulando...' : 'Anular Venta'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
