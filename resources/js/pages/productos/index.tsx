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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type Categoria,
    type PaginatedData,
    type Producto,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    productos: PaginatedData<Producto>;
    categorias: Categoria[];
    filters: {
        search?: string;
        categoria_id?: string;
        activo?: string;
        stock_bajo?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Productos', href: '/productos' },
];

export default function ProductosIndex({ productos, categorias, filters }: Props) {
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        producto: Producto | null;
    }>({ open: false, producto: null });
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteModal.producto) return;

        setDeleting(true);
        router.delete(`/productos/${deleteModal.producto.id}`, {
            onSuccess: () => {
                setDeleteModal({ open: false, producto: null });
                setDeleting(false);
            },
            onError: () => {
                setDeleting(false);
            },
        });
    };

    const handleCategoriaFilter = (value: string) => {
        router.get(
            '/productos',
            { ...filters, categoria_id: value === 'all' ? '' : value },
            { preserveState: true, replace: true },
        );
    };

    const columns = [
        {
            key: 'codigo',
            label: 'Código',
            render: (producto: Producto) => (
                <span className="font-mono text-sm">{producto.codigo}</span>
            ),
        },
        {
            key: 'nombre',
            label: 'Producto',
            render: (producto: Producto) => (
                <div>
                    <span className="font-medium">{producto.nombre}</span>
                </div>
            ),
        },
        {
            key: 'categoria',
            label: 'Categoría',
            render: (producto: Producto) => (
                <span className="text-muted-foreground">
                    {producto.categoria?.nombre || '-'}
                </span>
            ),
        },
        {
            key: 'precio_venta',
            label: 'Precio',
            render: (producto: Producto) => (
                <span className="font-medium">
                    S/ {Number(producto.precio_venta).toFixed(2)}
                </span>
            ),
        },
        {
            key: 'stock',
            label: 'Stock',
            render: (producto: Producto) => (
                <div className="flex items-center gap-2">
                    <span
                        className={
                            producto.stock <= producto.stock_minimo
                                ? 'font-medium text-red-600'
                                : ''
                        }
                    >
                        {producto.stock}
                    </span>
                    {producto.stock <= producto.stock_minimo && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                </div>
            ),
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (producto: Producto) => (
                <StatusBadge active={producto.estado} />
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Productos</h1>
                        <p className="text-muted-foreground">
                            Gestiona el inventario de juguetes
                        </p>
                    </div>
                    <Link href="/productos/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </Link>
                </div>

                {/* Tabla con filtros */}
                <DataTable
                    data={productos.data}
                    columns={columns}
                    pagination={{
                        currentPage: productos.current_page,
                        lastPage: productos.last_page,
                        perPage: productos.per_page,
                        total: productos.total,
                        from: productos.from,
                        to: productos.to,
                    }}
                    searchPlaceholder="Buscar por código, nombre..."
                    searchValue={filters.search}
                    baseUrl="/productos"
                    filters={
                        <Select
                            value={filters.categoria_id || 'all'}
                            onValueChange={handleCategoriaFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Todas las categorías
                                </SelectItem>
                                {categorias.map((cat) => (
                                    <SelectItem
                                        key={cat.id}
                                        value={cat.id.toString()}
                                    >
                                        {cat.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    }
                    actions={(producto) => (
                        <>
                            <Link href={`/productos/${producto.id}`}>
                                <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href={`/productos/${producto.id}/edit`}>
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
                                        producto,
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
                    setDeleteModal({ open, producto: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Producto</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar el producto "
                            {deleteModal.producto?.nombre}"? Esta acción no se
                            puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteModal({ open: false, producto: null })
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
