import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

import { DataTable, StatusBadge, EmptyState } from '@/components/data-table';
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
import { type Cliente, type PaginatedData } from '@/types';

interface Props {
    clientes: PaginatedData<Cliente>;
    filters: {
        search?: string;
        per_page?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Clientes', href: '/clientes' },
];

const tipoDocumentoLabels: Record<string, string> = {
    DNI: 'DNI',
    RUC: 'RUC',
    CE: 'Carnet de Extranjería',
};

export default function ClientesIndex({ clientes, filters }: Props) {
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; cliente: Cliente | null }>({
        open: false,
        cliente: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteDialog.cliente) return;

        setIsDeleting(true);
        router.delete(`/clientes/${deleteDialog.cliente.id}`, {
            onSuccess: () => {
                setDeleteDialog({ open: false, cliente: null });
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const columns = [
        {
            key: 'numero_documento',
            label: 'Documento',
            render: (cliente: Cliente) => (
                <div>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30">
                        {tipoDocumentoLabels[cliente.tipo_documento]}
                    </span>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white">{cliente.numero_documento}</p>
                </div>
            ),
        },
        {
            key: 'nombres',
            label: 'Cliente',
            render: (cliente: Cliente) => (
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                        {cliente.nombres} {cliente.apellidos}
                    </p>
                    {cliente.direccion && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{cliente.direccion}</p>
                    )}
                </div>
            ),
        },
        {
            key: 'contacto',
            label: 'Contacto',
            render: (cliente: Cliente) => (
                <div className="space-y-1">
                    {cliente.telefono && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="mr-1.5 h-3.5 w-3.5" />
                            {cliente.telefono}
                        </div>
                    )}
                    {cliente.email && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="mr-1.5 h-3.5 w-3.5" />
                            {cliente.email}
                        </div>
                    )}
                    {!cliente.telefono && !cliente.email && (
                        <span className="text-sm text-gray-400">Sin contacto</span>
                    )}
                </div>
            ),
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (cliente: Cliente) => <StatusBadge active={cliente.estado} />,
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (cliente: Cliente) => (
                <div className="flex items-center gap-2">
                    <Link href={`/clientes/${cliente.id}`}>
                        <Button variant="ghost" size="icon" title="Ver detalles">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/clientes/${cliente.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Editar">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        title="Eliminar"
                        onClick={() => setDeleteDialog({ open: true, cliente })}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
                        <p className="text-muted-foreground">
                            Gestiona los clientes de la juguetería LENNIN S.A.C.
                        </p>
                    </div>
                    <Link href="/clientes/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Cliente
                        </Button>
                    </Link>
                </div>

                {clientes.data.length > 0 || filters.search ? (
                    <DataTable
                        data={clientes.data}
                        columns={columns}
                        pagination={{
                            currentPage: clientes.current_page,
                            lastPage: clientes.last_page,
                            perPage: clientes.per_page,
                            total: clientes.total,
                            from: clientes.from,
                            to: clientes.to,
                        }}
                        searchValue={filters.search || ''}
                        searchPlaceholder="Buscar por nombre, documento..."
                        baseUrl="/clientes"
                        perPageOptions={[10, 25, 50, 100]}
                    />
                ) : (
                    <EmptyState
                        title="Sin clientes"
                        description="Aún no hay clientes registrados. Comienza agregando el primer cliente."
                        actionLabel="Nuevo Cliente"
                        actionHref="/clientes/create"
                    />
                )}
            </div>

            {/* Dialog de confirmación de eliminación */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, cliente: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar cliente?</DialogTitle>
                        <DialogDescription>
                            Esta acción eliminará al cliente "{deleteDialog.cliente?.nombres} {deleteDialog.cliente?.apellidos}".
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, cliente: null })}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
