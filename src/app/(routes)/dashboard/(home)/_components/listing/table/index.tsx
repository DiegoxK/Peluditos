"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Pet } from "@/server/db/schema";
import DataTableActions from "./actions";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Pencil, Search } from "lucide-react";
import DataTableHeader from "./header";
import { useDialog } from "@/context/dialog-provider";
import PetDetails from "./_components/pet-details";
import CreatePetForm from "./_components/create-pet-form";

import { api } from "@/trpc/react";
import { useTableState } from "@/context/table-state-provider";
import DataTableFooter from "./footer";

import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps {
  columns: ColumnDef<Pet, unknown>[];
}

export function DataTable({ columns }: DataTableProps) {
  const { openDialog } = useDialog();

  const {
    currentQueryInput,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    isUpdatingTable,
    isFilterProcessing,
  } = useTableState();

  const [serverResponse, { isFetching, status, error }] =
    api.pets.getAllPets.useSuspenseQuery(currentQueryInput);

  const tableData = useMemo(
    () => serverResponse?.data ?? [],
    [serverResponse?.data],
  );
  const totalRowCount = useMemo(
    () => serverResponse?.totalRowCount ?? 0,
    [serverResponse?.totalRowCount],
  );

  const table = useReactTable<Pet>({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: totalRowCount,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    debugTable: process.env.NODE_ENV === "development",
  });

  return (
    <div className="bg-sidebar border-sidebar-border space-y-4 border p-4">
      <DataTableHeader table={table} rowCount={totalRowCount} />

      {isFilterProcessing && (
        <div className="text-muted-foreground p-2 text-center text-sm">
          Escribiendo ...
        </div>
      )}

      {isUpdatingTable && (
        <div className="text-muted-foreground p-2 text-center text-sm">
          Actualizando suspense...
        </div>
      )}

      {isFetching && status === "success" && serverResponse && (
        <div className="text-muted-foreground p-2 text-center text-sm">
          Actualizando...
        </div>
      )}
      {status === "error" && error && (
        <div className="h-24 text-center text-red-500">
          Error al cargar mascotas: {error.message}
        </div>
      )}

      <div className="rounded-md border">
        <Table className="bg-background">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
                <TableHead className="pr-10 text-right font-semibold">
                  Acciones
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="mt-1 mr-1 flex items-center justify-end gap-1">
                        <Button
                          onClick={() =>
                            openDialog({
                              title: `Detalles de ${row.original.name}`,
                              description: "Información completa de la mascota",
                              content: () => <PetDetails pet={row.original} />,
                            })
                          }
                          variant="ghost"
                          size="icon"
                          aria-label={`Ver detalles de ${row.original.name}`}
                        >
                          <Search className="size-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            openDialog({
                              title: `Editar a ${row.original.name}`,
                              description:
                                "Complete los detalles de la mascota y guarde los cambios.",

                              content: () => (
                                <CreatePetForm pet={row.original} />
                              ),
                            })
                          }
                          variant="ghost"
                          size="icon"
                          aria-label={`Editar ${row.original.name}`}
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <DataTableActions pet={row.original} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : status === "success" &&
                !isFetching &&
                !table.getRowModel().rows.length && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-24 text-center"
                    >
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <DataTableFooter table={table} totalRowCount={totalRowCount} />
    </div>
  );
}

export function DataTableSkeleton() {
  return (
    <div className="bg-sidebar border-sidebar-border space-y-4 border p-4">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="rounded-md border">
        <Table className="bg-background">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-6 w-full" />
              </TableHead>
              <TableHead className="pr-10 text-right font-semibold">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
