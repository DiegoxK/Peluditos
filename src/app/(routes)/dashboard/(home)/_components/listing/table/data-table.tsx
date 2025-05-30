"use client";

import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
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
import DataTableActions from "./data-table-actions";

import { useState } from "react";

import { useDebouncedValue } from "@/hooks/use-debounce-value";

import { Button } from "@/components/ui/button";
import { Pencil, Search } from "lucide-react";
import DataTableHeader from "./data-table-header";
import { useDialog } from "@/context/dialog-provider";
import PetDetails from "../_components/pet-details";
import CreatePetForm from "../_components/create-pet-form";

interface DataTableProps<TData extends Pet, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Pet, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { openDialog, closeDialog } = useDialog();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const debouncedValue = useDebouncedValue(globalFilter, 500);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: debouncedValue,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <>
      <DataTableHeader
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        table={table}
      />
      <Table className="bg-background rounded-md border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
              <TableHead className="mr-11 flex items-center justify-end font-semibold">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell className="mt-1 mr-4 flex items-center justify-end gap-2">
                  <Button
                    onClick={() =>
                      openDialog({
                        title: `Detalles de ${row.original.name}`,
                        description: " Información completa de la mascota",
                        content: () => <PetDetails pet={row.original} />,
                      })
                    }
                    variant="ghost"
                    size="icon"
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
                          <CreatePetForm
                            pet={row.original}
                            closeDialog={closeDialog}
                          />
                        ),
                      })
                    }
                    variant="ghost"
                    size="icon"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <DataTableActions pet={row.original} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
