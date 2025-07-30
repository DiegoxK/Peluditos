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
import type { User } from "@/server/db/schema";
import UserDataTableActions from "./actions";
import { useMemo } from "react";
import DataTableHeader from "./header";
import { api } from "@/trpc/react";
import { useTableState } from "@/context/table-state-provider";
import DataTableFooter from "./footer";

interface DataTableProps {
  columns: ColumnDef<User, unknown>[];
}

export function DataTable({ columns }: DataTableProps) {
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
    api.users.getAllUsers.useSuspenseQuery(currentQueryInput);

  const tableData = useMemo(
    () => serverResponse?.data ?? [],
    [serverResponse?.data],
  );
  const totalRowCount = useMemo(
    () => serverResponse?.totalRowCount ?? 0,
    [serverResponse?.totalRowCount],
  );

  const table = useReactTable<User>({
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

  const isError = status === "error" && error && "Error al cargar usuarios";

  return (
    <div className="bg-sidebar border-sidebar-border space-y-4 rounded-lg border p-4">
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
                <TableHead className="w-[80px] pr-4 text-right font-semibold">
                  Acciones
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
                    {/* The Actions component contains all necessary actions in a clean dropdown */}
                    <UserDataTableActions user={row.original} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  {isFetching
                    ? "Cargando usuarios..."
                    : "No se encontraron resultados."}
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
