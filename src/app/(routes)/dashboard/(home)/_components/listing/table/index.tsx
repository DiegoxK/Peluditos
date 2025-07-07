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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const feedbackState = isFilterProcessing
    ? "Buscando..."
    : isUpdatingTable
      ? "Actualizando..."
      : isFetching &&
        status === "success" &&
        serverResponse &&
        "Refrescando...";

  const isError = status === "error" && error && "Error al cargar mascotas";

  return (
    <div className="bg-sidebar border-sidebar-border space-y-4 border p-4">
      <DataTableHeader
        table={table}
        rowCount={totalRowCount}
        feedbackState={feedbackState}
        isError={isError}
      />

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
                        <Tooltip delayDuration={1000}>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() =>
                                openDialog({
                                  title: `Detalles de ${row.original.name}`,
                                  description:
                                    "Información completa de la mascota",
                                  content: () => (
                                    <PetDetails pet={row.original} />
                                  ),
                                })
                              }
                              variant="ghost"
                              size="icon"
                              aria-label={`Ver detalles de ${row.original.name}`}
                            >
                              <Search className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip delayDuration={1000}>
                          <TooltipTrigger asChild>
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
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar</p>
                          </TooltipContent>
                        </Tooltip>
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
