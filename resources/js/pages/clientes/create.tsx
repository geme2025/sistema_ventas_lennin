import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

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
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Clientes', href: '/clientes' },
    { title: 'Nuevo Cliente', href: '/clientes/create' },
];

const tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'RUC', label: 'RUC' },
    { value: 'CE', label: 'Carnet de Extranjería' },
];

export default function ClientesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        tipo_documento: 'DNI',
        numero_documento: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        email: '',
        direccion: '',
        estado: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/clientes');
    };

    // Determinar longitud máxima según tipo de documento
    const getMaxLength = () => {
        switch (data.tipo_documento) {
            case 'DNI':
                return 8;
            case 'RUC':
                return 11;
            case 'CE':
                return 12;
            default:
                return 20;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Cliente" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/clientes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Nuevo Cliente</h1>
                        <p className="text-muted-foreground">
                            Registra un nuevo cliente en el sistema
                        </p>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-lg font-semibold">Datos del Documento</h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tipo_documento">Tipo de Documento *</Label>
                                    <Select
                                        value={data.tipo_documento}
                                        onValueChange={(value) => {
                                            setData('tipo_documento', value);
                                            setData('numero_documento', '');
                                        }}
                                    >
                                        <SelectTrigger id="tipo_documento">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tiposDocumento.map((tipo) => (
                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.tipo_documento && (
                                        <p className="text-sm text-red-500">{errors.tipo_documento}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="numero_documento">Número de Documento *</Label>
                                    <Input
                                        id="numero_documento"
                                        type="text"
                                        value={data.numero_documento}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= getMaxLength()) {
                                                setData('numero_documento', value);
                                            }
                                        }}
                                        placeholder={`Ingrese ${data.tipo_documento}`}
                                        maxLength={getMaxLength()}
                                    />
                                    {errors.numero_documento && (
                                        <p className="text-sm text-red-500">{errors.numero_documento}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        {data.numero_documento.length}/{getMaxLength()} dígitos
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-lg font-semibold">Información Personal</h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nombres">Nombres *</Label>
                                    <Input
                                        id="nombres"
                                        type="text"
                                        value={data.nombres}
                                        onChange={(e) => setData('nombres', e.target.value)}
                                        placeholder="Ingrese nombres"
                                    />
                                    {errors.nombres && (
                                        <p className="text-sm text-red-500">{errors.nombres}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellidos">Apellidos *</Label>
                                    <Input
                                        id="apellidos"
                                        type="text"
                                        value={data.apellidos}
                                        onChange={(e) => setData('apellidos', e.target.value)}
                                        placeholder="Ingrese apellidos"
                                    />
                                    {errors.apellidos && (
                                        <p className="text-sm text-red-500">{errors.apellidos}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-lg font-semibold">Información de Contacto</h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input
                                        id="telefono"
                                        type="tel"
                                        value={data.telefono}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 15) {
                                                setData('telefono', value);
                                            }
                                        }}
                                        placeholder="Ingrese teléfono"
                                    />
                                    {errors.telefono && (
                                        <p className="text-sm text-red-500">{errors.telefono}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="ejemplo@correo.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="direccion">Dirección</Label>
                                    <Textarea
                                        id="direccion"
                                        value={data.direccion}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('direccion', e.target.value)}
                                        placeholder="Ingrese dirección completa"
                                        rows={2}
                                    />
                                    {errors.direccion && (
                                        <p className="text-sm text-red-500">{errors.direccion}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="estado"
                                    checked={data.estado}
                                    onCheckedChange={(checked) => setData('estado', checked as boolean)}
                                />
                                <Label htmlFor="estado" className="cursor-pointer">
                                    Cliente activo
                                </Label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/clientes">
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar Cliente'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
