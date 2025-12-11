import { StatusBadge } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Producto } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Edit, Package } from 'lucide-react';

interface Props {
    producto: Producto;
}

export default function ProductosShow({ producto }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Productos', href: '/productos' },
        { title: producto.nombre, href: `/productos/${producto.id}` },
    ];

    const stockBajo = producto.stock <= producto.stock_minimo;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={producto.nombre} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/productos">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{producto.nombre}</h1>
                            <p className="text-muted-foreground font-mono">
                                {producto.codigo}
                            </p>
                        </div>
                    </div>
                    <Link href={`/productos/${producto.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </Link>
                </div>

                {/* Alerta de stock bajo */}
                {stockBajo && (
                    <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div>
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                Stock bajo
                            </p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                El stock actual ({producto.stock}) está por debajo del
                                mínimo ({producto.stock_minimo})
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Información General */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Información del Producto
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-muted-foreground text-sm font-medium">
                                        Categoría
                                    </dt>
                                    <dd className="mt-1">
                                        {producto.categoria?.nombre || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground text-sm font-medium">
                                        Estado
                                    </dt>
                                    <dd className="mt-1">
                                        <StatusBadge active={producto.estado} />
                                    </dd>
                                </div>
                                {producto.descripcion && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-muted-foreground text-sm font-medium">
                                            Descripción
                                        </dt>
                                        <dd className="mt-1">{producto.descripcion}</dd>
                                    </div>
                                )}
                            </dl>
                        </CardContent>
                    </Card>

                    {/* Precios */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Precios</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Precio de Compra
                                </p>
                                <p className="text-xl font-semibold">
                                    S/ {Number(producto.precio_compra).toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Precio de Venta
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    S/ {Number(producto.precio_venta).toFixed(2)}
                                </p>
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-muted-foreground text-sm">
                                    Margen de Ganancia
                                </p>
                                <p className="text-lg font-semibold">
                                    S/{' '}
                                    {(
                                        Number(producto.precio_venta) -
                                        Number(producto.precio_compra)
                                    ).toFixed(2)}{' '}
                                    <span className="text-muted-foreground text-sm">
                                        (
                                        {(
                                            ((Number(producto.precio_venta) -
                                                Number(producto.precio_compra)) /
                                                Number(producto.precio_compra)) *
                                            100
                                        ).toFixed(1)}
                                        %)
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inventario */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Inventario</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Stock Actual
                                </p>
                                <p
                                    className={`text-3xl font-bold ${stockBajo ? 'text-red-600' : ''}`}
                                >
                                    {producto.stock}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Stock Mínimo
                                </p>
                                <p className="text-lg">{producto.stock_minimo}</p>
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-muted-foreground text-sm">
                                    Valor en Inventario
                                </p>
                                <p className="text-lg font-semibold">
                                    S/{' '}
                                    {(
                                        producto.stock * Number(producto.precio_venta)
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
