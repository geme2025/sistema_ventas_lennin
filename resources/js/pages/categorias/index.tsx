import { DataTable, StatusBadge } from '@/components/data-table';
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
import { type BreadcrumbItem, type Categoria, type PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    categorias: PaginatedData<Categoria>;
    filters: {
        search?: string;
        activo?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categorías', href: '/categorias' },
];

export default function CategoriasIndex({ categorias, filters }: Props) {
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        categoria: Categoria | null;
    }>({ open: false, categoria: null });
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteModal.categoria) return;

        setDeleting(true);
        router.delete(`/categorias/${deleteModal.categoria.id}`, {
            onSuccess: () => {
                setDeleteModal({ open: false, categoria: null });
                setDeleting(false);
            },
            onError: () => {
                setDeleting(false);
            },
        });
    };

    const columns = [
        {
            key: 'nombre',
            label: 'Nombre',
            render: (categoria: Categoria) => (
                <span className="font-medium">{categoria.nombre}</span>
            ),
        },
        {
            key: 'descripcion',
            label: 'Descripción',
            render: (categoria: Categoria) => (
                <span className="text-muted-foreground max-w-xs truncate">
                    {categoria.descripcion || '-'}
                </span>
            ),
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (categoria: Categoria) => (
                <StatusBadge active={categoria.estado} />
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorías" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Categorías</h1>
                        <p className="text-muted-foreground">
                            Gestiona las categorías de productos
                        </p>
                    </div>
                    <Link href="/categorias/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Categoría
                        </Button>
                    </Link>
                </div>

                {/* Tabla */}
                <DataTable
                    data={categorias.data}
                    columns={columns}
                    pagination={{
                        currentPage: categorias.current_page,
                        lastPage: categorias.last_page,
                        perPage: categorias.per_page,
                        total: categorias.total,
                        from: categorias.from,
                        to: categorias.to,
                    }}
                    searchPlaceholder="Buscar categorías..."
                    searchValue={filters.search}
                    baseUrl="/categorias"
                    actions={(categoria) => (
                        <>
                            <Link href={`/categorias/${categoria.id}/edit`}>
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setDeleteModal({
                                        open: true,
                                        categoria,
                                    })
                                }
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </>
                    )}
                />
            </div>

            {/* Modal de confirmación de eliminación */}
            <Dialog
                open={deleteModal.open}
                onOpenChange={(open) =>
                    setDeleteModal({ open, categoria: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Categoría</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar la categoría "
                            {deleteModal.categoria?.nombre}"? Esta acción no se
                            puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteModal({ open: false, categoria: null })
                            }
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
