import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Categoria } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface Props {
    categorias: Categoria[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Productos', href: '/productos' },
    { title: 'Nuevo Producto', href: '/productos/create' },
];

export default function ProductosCreate({ categorias }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        codigo: '',
        nombre: '',
        descripcion: '',
        categoria_id: '',
        precio_compra: '',
        precio_venta: '',
        stock: '0',
        stock_minimo: '5',
        marca: '',
        edad_recomendada: '',
        activo: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/productos');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Producto" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/productos">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Nuevo Producto</h1>
                        <p className="text-muted-foreground">
                            Agrega un nuevo juguete al inventario
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="grid max-w-4xl gap-4 md:grid-cols-2">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Información Básica</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="codigo">
                                        Código <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="codigo"
                                        value={data.codigo}
                                        onChange={(e) =>
                                            setData('codigo', e.target.value)
                                        }
                                        placeholder="JUG-001"
                                        className={errors.codigo ? 'border-red-500' : ''}
                                    />
                                    {errors.codigo && (
                                        <p className="text-sm text-red-500">
                                            {errors.codigo}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nombre">
                                        Nombre <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) =>
                                            setData('nombre', e.target.value)
                                        }
                                        placeholder="Nombre del juguete"
                                        className={errors.nombre ? 'border-red-500' : ''}
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-red-500">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="categoria_id">
                                        Categoría <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.categoria_id}
                                        onValueChange={(value) =>
                                            setData('categoria_id', value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.categoria_id
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        >
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    {errors.categoria_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.categoria_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="marca">Marca</Label>
                                    <Input
                                        id="marca"
                                        value={data.marca}
                                        onChange={(e) =>
                                            setData('marca', e.target.value)
                                        }
                                        placeholder="Ej: Hasbro, Mattel"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <textarea
                                        id="descripcion"
                                        value={data.descripcion}
                                        onChange={(e) =>
                                            setData('descripcion', e.target.value)
                                        }
                                        placeholder="Descripción del producto..."
                                        rows={3}
                                        className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edad_recomendada">
                                        Edad Recomendada
                                    </Label>
                                    <Input
                                        id="edad_recomendada"
                                        value={data.edad_recomendada}
                                        onChange={(e) =>
                                            setData('edad_recomendada', e.target.value)
                                        }
                                        placeholder="Ej: 3+ años"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Precios</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="precio_compra">
                                        Precio de Compra{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                                            S/
                                        </span>
                                        <Input
                                            id="precio_compra"
                                            type="number"
                                            step="0.01"
                                            value={data.precio_compra}
                                            onChange={(e) =>
                                                setData('precio_compra', e.target.value)
                                            }
                                            placeholder="0.00"
                                            className={`pl-9 ${errors.precio_compra ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.precio_compra && (
                                        <p className="text-sm text-red-500">
                                            {errors.precio_compra}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="precio_venta">
                                        Precio de Venta{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                                            S/
                                        </span>
                                        <Input
                                            id="precio_venta"
                                            type="number"
                                            step="0.01"
                                            value={data.precio_venta}
                                            onChange={(e) =>
                                                setData('precio_venta', e.target.value)
                                            }
                                            placeholder="0.00"
                                            className={`pl-9 ${errors.precio_venta ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.precio_venta && (
                                        <p className="text-sm text-red-500">
                                            {errors.precio_venta}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Inventario</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stock">
                                        Stock Actual{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) =>
                                            setData('stock', e.target.value)
                                        }
                                        placeholder="0"
                                        className={errors.stock ? 'border-red-500' : ''}
                                    />
                                    {errors.stock && (
                                        <p className="text-sm text-red-500">
                                            {errors.stock}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock_minimo">
                                        Stock Mínimo{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="stock_minimo"
                                        type="number"
                                        value={data.stock_minimo}
                                        onChange={(e) =>
                                            setData('stock_minimo', e.target.value)
                                        }
                                        placeholder="5"
                                        className={
                                            errors.stock_minimo ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.stock_minimo && (
                                        <p className="text-sm text-red-500">
                                            {errors.stock_minimo}
                                        </p>
                                    )}
                                    <p className="text-muted-foreground text-xs">
                                        Se alertará cuando el stock baje de este valor
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="activo"
                                        checked={data.activo}
                                        onCheckedChange={(checked) =>
                                            setData('activo', checked as boolean)
                                        }
                                    />
                                    <Label htmlFor="activo">Producto activo</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Botones de acción */}
                        <div className="flex gap-2 md:col-span-2">
                            <Link href="/productos">
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
