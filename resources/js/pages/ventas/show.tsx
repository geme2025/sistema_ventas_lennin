import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Printer, Ban, User, Calendar, Receipt, Package, FileText } from 'lucide-react';
import { useState } from 'react';

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
import { type BreadcrumbItem, type Venta } from '@/types';

interface Props {
    venta: Venta;
}

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

export default function VentasShow({ venta }: Props) {
    const [anularDialog, setAnularDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Ventas', href: '/ventas' },
        { title: venta.numero_venta, href: `/ventas/${venta.id}` },
    ];

    const handleAnular = () => {
        setIsProcessing(true);
        router.post(`/ventas/${venta.id}/anular`, {}, {
            onSuccess: () => {
                setAnularDialog(false);
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (value: number | string) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(Number(value));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Venta ${venta.numero_venta}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/ventas">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">{venta.numero_venta}</h1>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${estadoColors[venta.estado]}`}>
                                    {venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
                                </span>
                            </div>
                            <p className="text-muted-foreground">Detalle de la venta</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                        </Button>
                        {venta.estado === 'completada' && (
                            <Button variant="destructive" onClick={() => setAnularDialog(true)}>
                                <Ban className="mr-2 h-4 w-4" />
                                Anular Venta
                            </Button>
                        )}
                    </div>
                </div>

                <div className="mx-auto w-full max-w-5xl print:max-w-none">
                    {/* Encabezado de la boleta */}
                    <div className="mb-6 rounded-lg border bg-card p-6 print:border-0 print:p-0">
                        <div className="mb-6 text-center print:mb-8">
                            <h2 className="text-2xl font-bold">JUGUETERÍA LENNIN S.A.C.</h2>
                            <p className="text-muted-foreground">RUC: 20123456789</p>
                            <p className="text-muted-foreground">Av. Principal 123 - Lima, Perú</p>
                            <p className="text-muted-foreground">Tel: (01) 123-4567</p>
                        </div>

                        <div className="mb-6 grid gap-6 md:grid-cols-3">
                            {/* Información de la venta */}
                            <div className="rounded-lg bg-muted/50 p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <Receipt className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold">Información de Venta</h3>
                                </div>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">N° Venta:</dt>
                                        <dd className="font-mono font-medium">{venta.numero_venta}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Fecha:</dt>
                                        <dd>{formatDate(venta.fecha_venta)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Método Pago:</dt>
                                        <dd>{metodoPagoLabels[venta.metodo_pago]}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Información del cliente */}
                            <div className="rounded-lg bg-muted/50 p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold">Cliente</h3>
                                </div>
                                {venta.cliente ? (
                                    <dl className="space-y-2 text-sm">
                                        <div>
                                            <dt className="text-muted-foreground">Nombre:</dt>
                                            <dd className="font-medium">{venta.cliente.nombres} {venta.cliente.apellidos}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">{venta.cliente.tipo_documento}:</dt>
                                            <dd>{venta.cliente.numero_documento}</dd>
                                        </div>
                                        {venta.cliente.direccion && (
                                            <div>
                                                <dt className="text-muted-foreground">Dirección:</dt>
                                                <dd>{venta.cliente.direccion}</dd>
                                            </div>
                                        )}
                                    </dl>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Cliente General</p>
                                )}
                            </div>

                            {/* Vendedor */}
                            <div className="rounded-lg bg-muted/50 p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold">Vendedor</h3>
                                </div>
                                <dl className="space-y-2 text-sm">
                                    <div>
                                        <dt className="text-muted-foreground">Nombre:</dt>
                                        <dd className="font-medium">{venta.user?.name || 'No especificado'}</dd>
                                    </div>
                                    {venta.user?.email && (
                                        <div>
                                            <dt className="text-muted-foreground">Email:</dt>
                                            <dd>{venta.user.email}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        {/* Detalle de productos */}
                        <div className="mb-6">
                            <div className="mb-3 flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold">Detalle de Productos</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="px-4 py-3 text-left font-medium">#</th>
                                            <th className="px-4 py-3 text-left font-medium">Producto</th>
                                            <th className="px-4 py-3 text-center font-medium">Cantidad</th>
                                            <th className="px-4 py-3 text-right font-medium">P. Unit.</th>
                                            <th className="px-4 py-3 text-right font-medium">Descuento</th>
                                            <th className="px-4 py-3 text-right font-medium">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {venta.detalles?.map((detalle, index) => (
                                            <tr key={detalle.id} className="border-b">
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="font-medium">{detalle.producto?.nombre || 'Producto eliminado'}</p>
                                                        <p className="text-xs text-muted-foreground">{detalle.producto?.codigo}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">{detalle.cantidad}</td>
                                                <td className="px-4 py-3 text-right">{formatCurrency(detalle.precio_unitario)}</td>
                                                <td className="px-4 py-3 text-right text-red-500">
                                                    {Number(detalle.descuento) > 0 ? `-${formatCurrency(detalle.descuento)}` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium">{formatCurrency(detalle.subtotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totales */}
                        <div className="flex justify-end">
                            <div className="w-full max-w-xs space-y-2 rounded-lg bg-muted/50 p-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span>{formatCurrency(venta.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">IGV (18%):</span>
                                    <span>{formatCurrency(venta.igv)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 text-xl font-bold">
                                    <span>Total:</span>
                                    <span className="text-green-600">{formatCurrency(venta.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Observaciones */}
                        {venta.observaciones && (
                            <div className="mt-6 rounded-lg bg-muted/50 p-4">
                                <h3 className="mb-2 font-semibold">Observaciones</h3>
                                <p className="text-sm text-muted-foreground">{venta.observaciones}</p>
                            </div>
                        )}

                        {/* Pie de boleta */}
                        <div className="mt-8 text-center text-sm text-muted-foreground print:mt-12">
                            <p>¡Gracias por su compra!</p>
                            <p>Juguetería LENNIN S.A.C. - Donde los sueños se hacen realidad</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog de confirmación de anulación */}
            <Dialog open={anularDialog} onOpenChange={setAnularDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Anular venta?</DialogTitle>
                        <DialogDescription>
                            Esta acción anulará la venta <strong>{venta.numero_venta}</strong> y
                            restaurará el stock de los productos. Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAnularDialog(false)}
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
