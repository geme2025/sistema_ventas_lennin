import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Minus, Trash2, Search, ShoppingCart, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { FormEventHandler, useState, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Cliente, type Producto } from '@/types';

interface Props {
    clientes: Cliente[];
    productos: Producto[];
}

interface CartItem {
    producto: Producto;
    cantidad: number;
    descuento: number;
    subtotal: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ventas', href: '/ventas' },
    { title: 'Nueva Venta', href: '/ventas/create' },
];

const metodosPago = [
    { value: 'efectivo', label: 'Efectivo', icon: '💵' },
    { value: 'tarjeta', label: 'Tarjeta', icon: '💳' },
    { value: 'transferencia', label: 'Transferencia', icon: '🏦' },
    { value: 'yape', label: 'Yape', icon: '📱' },
    { value: 'plin', label: 'Plin', icon: '📲' },
];

const IGV_RATE = 0.18;

export default function VentasCreate({ clientes, productos }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        cliente_id: '',
        metodo_pago: 'efectivo',
        observaciones: '',
        detalles: [] as { producto_id: number; cantidad: number; precio_unitario: number; descuento: number; subtotal: number }[],
    });

    // Filtrar productos por búsqueda
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return productos;
        const query = searchQuery.toLowerCase();
        return productos.filter(
            (p) =>
                p.nombre.toLowerCase().includes(query) ||
                p.codigo.toLowerCase().includes(query) ||
                p.categoria?.nombre.toLowerCase().includes(query)
        );
    }, [productos, searchQuery]);

    // Calcular totales
    const totals = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
        const igv = subtotal * IGV_RATE;
        const total = subtotal + igv;
        return { subtotal, igv, total };
    }, [cart]);

    // Agregar producto al carrito
    const addToCart = (producto: Producto) => {
        const existingIndex = cart.findIndex((item) => item.producto.id === producto.id);

        if (existingIndex >= 0) {
            // Incrementar cantidad si ya existe
            const newCart = [...cart];
            const newCantidad = newCart[existingIndex].cantidad + 1;

            if (newCantidad > producto.stock) {
                alert(`Stock insuficiente. Disponible: ${producto.stock}`);
                return;
            }

            newCart[existingIndex].cantidad = newCantidad;
            newCart[existingIndex].subtotal = newCantidad * Number(producto.precio_venta) - newCart[existingIndex].descuento;
            setCart(newCart);
        } else {
            // Agregar nuevo producto
            if (producto.stock < 1) {
                alert('Producto sin stock disponible');
                return;
            }

            setCart([
                ...cart,
                {
                    producto,
                    cantidad: 1,
                    descuento: 0,
                    subtotal: Number(producto.precio_venta),
                },
            ]);
        }
    };

    // Actualizar cantidad de un item
    const updateQuantity = (index: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        const item = cart[index];
        if (newQuantity > item.producto.stock) {
            alert(`Stock insuficiente. Disponible: ${item.producto.stock}`);
            return;
        }

        const newCart = [...cart];
        newCart[index].cantidad = newQuantity;
        newCart[index].subtotal = newQuantity * Number(item.producto.precio_venta) - item.descuento;
        setCart(newCart);
    };

    // Actualizar descuento de un item
    const updateDiscount = (index: number, newDiscount: number) => {
        const newCart = [...cart];
        const item = newCart[index];
        const maxDiscount = item.cantidad * Number(item.producto.precio_venta);

        newCart[index].descuento = Math.min(Math.max(0, newDiscount), maxDiscount);
        newCart[index].subtotal = item.cantidad * Number(item.producto.precio_venta) - newCart[index].descuento;
        setCart(newCart);
    };

    // Remover item del carrito
    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    // Procesar pago (simulado)
    const processPayment = () => {
        setIsProcessing(true);

        // Simular proceso de pago (2 segundos)
        setTimeout(() => {
            setIsProcessing(false);
            // Simular éxito del 95% de las veces
            const success = Math.random() < 0.95;

            if (success) {
                setPaymentSuccess(true);
                // Preparar detalles para enviar
                const detalles = cart.map((item) => ({
                    producto_id: item.producto.id,
                    cantidad: item.cantidad,
                    precio_unitario: Number(item.producto.precio_venta),
                    descuento: item.descuento,
                    subtotal: item.subtotal,
                }));

                // Enviar venta al servidor después de mostrar éxito
                setTimeout(() => {
                    router.post('/ventas', {
                        cliente_id: data.cliente_id || null,
                        metodo_pago: data.metodo_pago,
                        observaciones: data.observaciones,
                        detalles,
                    });
                }, 1500);
            } else {
                // Simular error de pago
                alert('Error al procesar el pago. Por favor, intente nuevamente.');
            }
        }, 2000);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Venta - Punto de Venta" />

            <div className="flex h-full flex-1 flex-col lg:flex-row">
                {/* Panel de Productos */}
                <div className="flex flex-1 flex-col border-b p-4 lg:border-b-0 lg:border-r">
                    <div className="mb-4 flex items-center gap-4">
                        <Link href="/ventas">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Punto de Venta</h1>
                            <p className="text-sm text-muted-foreground">
                                Selecciona productos para agregar a la venta
                            </p>
                        </div>
                    </div>

                    {/* Buscador */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, código o categoría..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Grid de Productos */}
                    <div className="flex-1 overflow-auto">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((producto) => (
                                <button
                                    key={producto.id}
                                    onClick={() => addToCart(producto)}
                                    disabled={producto.stock < 1}
                                    className={`rounded-lg border p-3 text-left transition-all hover:border-primary hover:shadow-md ${
                                        producto.stock < 1 ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <span className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                            {producto.categoria?.nombre || 'Sin categoría'}
                                        </span>
                                        <span className={`text-xs font-medium ${producto.stock < producto.stock_minimo ? 'text-red-500' : 'text-green-600'}`}>
                                            Stock: {producto.stock}
                                        </span>
                                    </div>
                                    <h3 className="mb-1 line-clamp-2 font-medium">{producto.nombre}</h3>
                                    <p className="text-xs text-muted-foreground">{producto.codigo}</p>
                                    <p className="mt-2 text-lg font-bold text-green-600">
                                        {formatCurrency(Number(producto.precio_venta))}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <p className="text-muted-foreground">
                                    No se encontraron productos con "{searchQuery}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel de Carrito */}
                <div className="flex w-full flex-col bg-muted/30 p-4 lg:w-96">
                    <div className="mb-4 flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Carrito de Venta</h2>
                        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            {cart.length} items
                        </span>
                    </div>

                    {/* Selección de Cliente */}
                    <div className="mb-4 space-y-2">
                        <Label>Cliente (opcional)</Label>
                        <Select
                            value={data.cliente_id}
                            onValueChange={(value) => setData('cliente_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Cliente General</SelectItem>
                                {clientes.map((cliente) => (
                                    <SelectItem key={cliente.id} value={String(cliente.id)}>
                                        {cliente.nombres} {cliente.apellidos} - {cliente.numero_documento}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Items del Carrito */}
                    <div className="flex-1 space-y-3 overflow-auto">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">
                                    El carrito está vacío
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Selecciona productos para agregar
                                </p>
                            </div>
                        ) : (
                            cart.map((item, index) => (
                                <div key={item.producto.id} className="rounded-lg border bg-card p-3">
                                    <div className="mb-2 flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="line-clamp-1 font-medium">{item.producto.nombre}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {formatCurrency(Number(item.producto.precio_venta))} c/u
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => removeFromCart(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(index, item.cantidad - 1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center font-medium">{item.cantidad}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(index, item.cantidad + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                                    </div>
                                    {/* Descuento */}
                                    <div className="mt-2 flex items-center gap-2">
                                        <Label className="text-xs">Descuento:</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={item.descuento}
                                            onChange={(e) => updateDiscount(index, Number(e.target.value))}
                                            className="h-7 w-20 text-xs"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Totales */}
                    <div className="mt-4 space-y-2 border-t pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">IGV (18%)</span>
                            <span>{formatCurrency(totals.igv)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-green-600">{formatCurrency(totals.total)}</span>
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="mt-4 space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                            id="observaciones"
                            value={data.observaciones}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('observaciones', e.target.value)}
                            placeholder="Notas adicionales..."
                            rows={2}
                            className="text-sm"
                        />
                    </div>

                    {/* Botón de Pago */}
                    <Button
                        className="mt-4 h-12 text-lg"
                        disabled={cart.length === 0}
                        onClick={() => setPaymentDialog(true)}
                    >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Proceder al Pago
                    </Button>
                </div>
            </div>

            {/* Dialog de Pago */}
            <Dialog open={paymentDialog} onOpenChange={(open) => !isProcessing && !paymentSuccess && setPaymentDialog(open)}>
                <DialogContent className="sm:max-w-md">
                    {!isProcessing && !paymentSuccess ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Confirmar Pago</DialogTitle>
                                <DialogDescription>
                                    Selecciona el método de pago para completar la venta
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Label className="mb-3 block">Método de Pago</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {metodosPago.map((metodo) => (
                                        <button
                                            key={metodo.value}
                                            onClick={() => setData('metodo_pago', metodo.value)}
                                            className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                                                data.metodo_pago === metodo.value
                                                    ? 'border-primary bg-primary/10'
                                                    : 'hover:border-primary/50'
                                            }`}
                                        >
                                            <span className="text-2xl">{metodo.icon}</span>
                                            <span className="font-medium">{metodo.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 rounded-lg bg-muted p-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(totals.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>IGV (18%)</span>
                                        <span>{formatCurrency(totals.igv)}</span>
                                    </div>
                                    <div className="mt-2 flex justify-between border-t pt-2 text-xl font-bold">
                                        <span>Total a Pagar</span>
                                        <span className="text-green-600">{formatCurrency(totals.total)}</span>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setPaymentDialog(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={processPayment}>
                                    Confirmar Pago
                                </Button>
                            </DialogFooter>
                        </>
                    ) : isProcessing ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <h3 className="text-lg font-semibold">Procesando pago...</h3>
                            <p className="text-sm text-muted-foreground">
                                Por favor espere un momento
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-green-600">¡Pago Exitoso!</h3>
                            <p className="mt-2 text-center text-muted-foreground">
                                La venta se ha procesado correctamente.
                                <br />
                                Redirigiendo...
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
