import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    X,
} from 'lucide-react';
import { ReactNode, useCallback, useState } from 'react';

interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => ReactNode;
    className?: string;
}

interface PaginationInfo {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    pagination?: PaginationInfo;
    searchPlaceholder?: string;
    filters?: ReactNode;
    actions?: (item: T) => ReactNode;
    onSearch?: (value: string) => void;
    searchValue?: string;
    baseUrl: string;
    perPageOptions?: number[];
}

export function DataTable<T extends { id: number }>({
    data,
    columns,
    pagination,
    searchPlaceholder = 'Buscar...',
    filters,
    actions,
    searchValue = '',
    baseUrl,
    perPageOptions = [10, 25, 50, 100],
}: DataTableProps<T>) {
    const [search, setSearch] = useState(searchValue);

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            router.get(
                baseUrl,
                { search: value, per_page: pagination?.perPage },
                { preserveState: true, replace: true },
            );
        },
        [baseUrl, pagination?.perPage],
    );

    const handleClearSearch = () => {
        setSearch('');
        router.get(baseUrl, { per_page: pagination?.perPage }, { preserveState: true, replace: true });
    };

    const goToPage = (page: number) => {
        router.get(
            baseUrl,
            { page, search, per_page: pagination?.perPage },
            { preserveState: true, replace: true },
        );
    };

    const handlePerPageChange = (value: string) => {
        router.get(
            baseUrl,
            { search, per_page: parseInt(value), page: 1 },
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="space-y-4">
            {/* Barra de búsqueda y filtros */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9 pr-9"
                    />
                    {search && (
                        <button
                            onClick={handleClearSearch}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                {filters && <div className="flex gap-2">{filters}</div>}
            </div>

            {/* Tabla */}
            <div className="rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/50 border-b">
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={`px-4 py-3 text-left text-sm font-medium ${column.className || ''}`}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                                {actions && (
                                    <th className="px-4 py-3 text-right text-sm font-medium">
                                        Acciones
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            columns.length + (actions ? 1 : 0)
                                        }
                                        className="text-muted-foreground px-4 py-8 text-center"
                                    >
                                        No se encontraron registros
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-muted/30 border-b transition-colors last:border-0"
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={`${item.id}-${column.key}`}
                                                className={`px-4 py-3 text-sm ${column.className || ''}`}
                                            >
                                                {column.render
                                                    ? column.render(item)
                                                    : (item as Record<string, unknown>)[
                                                          column.key
                                                      ]?.toString() || '-'}
                                            </td>
                                        ))}
                                        {actions && (
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {actions(item)}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación */}
            {pagination && pagination.lastPage > 1 && (
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-4">
                        <p className="text-muted-foreground text-sm">
                            Mostrando {pagination.from} a {pagination.to} de {pagination.total} registros
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Por página:</span>
                            <Select
                                value={pagination.perPage.toString()}
                                onValueChange={handlePerPageChange}
                            >
                                <SelectTrigger className="w-16">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {perPageOptions.map((option) => (
                                        <SelectItem key={option} value={option.toString()}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(1)}
                            disabled={pagination.currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            <span className="text-sm">Página</span>
                            <Select
                                value={pagination.currentPage.toString()}
                                onValueChange={(value) =>
                                    goToPage(parseInt(value))
                                }
                            >
                                <SelectTrigger className="w-16">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from(
                                        { length: pagination.lastPage },
                                        (_, i) => i + 1,
                                    ).map((page) => (
                                        <SelectItem
                                            key={page}
                                            value={page.toString()}
                                        >
                                            {page}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-sm">de {pagination.lastPage}</span>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.lastPage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(pagination.lastPage)}
                            disabled={pagination.currentPage === pagination.lastPage}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Componente de Badge para estados
interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    children: ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
    const variants = {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
        success:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        warning:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
        >
            {children}
        </span>
    );
}

// Componente helper para mostrar estado activo/inactivo
interface StatusBadgeProps {
    active: boolean;
    activeLabel?: string;
    inactiveLabel?: string;
}

export function StatusBadge({ active, activeLabel = 'Activo', inactiveLabel = 'Inactivo' }: StatusBadgeProps) {
    return (
        <Badge variant={active ? 'success' : 'danger'}>
            {active ? activeLabel : inactiveLabel}
        </Badge>
    );
}

// Componente para estados vacíos
interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    icon?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, actionHref, icon }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            {icon ? (
                icon
            ) : (
                <div className="mb-4 rounded-full bg-muted p-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                </div>
            )}
            <h3 className="mb-1 text-lg font-semibold">{title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{description}</p>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <Button>{actionLabel}</Button>
                </Link>
            )}
        </div>
    );
}
