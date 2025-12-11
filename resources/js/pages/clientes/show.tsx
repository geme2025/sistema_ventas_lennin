import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Phone, Mail, MapPin, FileText, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Cliente } from '@/types';

interface Props {
    cliente: Cliente;
}

const tipoDocumentoLabels: Record<string, string> = {
    DNI: 'DNI',
    RUC: 'RUC',
    CE: 'Carnet de Extranjería',
};

export default function ClientesShow({ cliente }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Clientes', href: '/clientes' },
        { title: `${cliente.nombres} ${cliente.apellidos}`, href: `/clientes/${cliente.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${cliente.nombres} ${cliente.apellidos}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/clientes">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {cliente.nombres} {cliente.apellidos}
                            </h1>
                            <p className="text-muted-foreground">Detalles del cliente</p>
                        </div>
                    </div>
                    <Link href={`/clientes/${cliente.id}/edit`}>
                        <Button>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-4xl">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Información del Documento */}
                        <div className="rounded-lg border bg-card p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <h2 className="text-lg font-semibold">Documento</h2>
                            </div>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm text-muted-foreground">Tipo de Documento</dt>
                                    <dd className="mt-1">
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30">
                                            {tipoDocumentoLabels[cliente.tipo_documento]}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-muted-foreground">Número de Documento</dt>
                                    <dd className="mt-1 text-lg font-semibold">{cliente.numero_documento}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Estado */}
                        <div className="rounded-lg border bg-card p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <h2 className="text-lg font-semibold">Estado</h2>
                            </div>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm text-muted-foreground">Estado del Cliente</dt>
                                    <dd className="mt-1">
                                        <StatusBadge active={cliente.estado} />
                                    </dd>
                                </div>
                                {cliente.created_at && (
                                    <div>
                                        <dt className="text-sm text-muted-foreground">Fecha de Registro</dt>
                                        <dd className="mt-1">
                                            {new Date(cliente.created_at).toLocaleDateString('es-PE', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </dd>
                                    </div>
                                )}
                                {cliente.updated_at && (
                                    <div>
                                        <dt className="text-sm text-muted-foreground">Última Actualización</dt>
                                        <dd className="mt-1">
                                            {new Date(cliente.updated_at).toLocaleDateString('es-PE', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Información de Contacto */}
                        <div className="rounded-lg border bg-card p-6 md:col-span-2">
                            <h2 className="mb-4 text-lg font-semibold">Información de Contacto</h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Teléfono</p>
                                        <p className="font-medium">
                                            {cliente.telefono || (
                                                <span className="text-muted-foreground">No registrado</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                                        <p className="font-medium">
                                            {cliente.email || (
                                                <span className="text-muted-foreground">No registrado</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Dirección</p>
                                        <p className="font-medium">
                                            {cliente.direccion || (
                                                <span className="text-muted-foreground">No registrada</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
