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
import type { Order } from "@/server/db/schema";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search, Truck } from "lucide-react";
import { useDialog } from "@/context/dialog-provider";
import { api } from "@/trpc/react";
import { useTableState } from "@/context/table-state-provider";
import DataTableHeader from "./header";
import DataTableFooter from "./footer";
import DataTableActions from "./actions";
import OrderDetails from "./_components/order-details";
import MarkAsShippedForm from "./_components/mark-as-shipped-form";

interface DataTableProps {
  columns: ColumnDef<Order, unknown>[];
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
    api.orders.getAllOrders.useSuspenseQuery(currentQueryInput);

  const tableData = useMemo(
    () => serverResponse?.data ?? [],
    [serverResponse?.data],
  );
  const totalRowCount = useMemo(
    () => serverResponse?.totalRowCount ?? 0,
    [serverResponse?.totalRowCount],
  );

  const table = useReactTable<Order>({
    data: tableData,
    columns,
    state: { sorting, columnFilters, pagination },
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

  const isError = status === "error" && error && "Error al cargar pedidos";

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
                <TableHead className="w-[120px] pr-2 text-right font-semibold">
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
                    <div className="mr-1 flex items-center justify-end gap-1">
                      <Tooltip delayDuration={1000}>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() =>
                              openDialog({
                                title: `Detalles del Pedido ${row.original.orderId}`,
                                description:
                                  "Información completa del pedido, cliente y envío.",
                                content: () => (
                                  <OrderDetails order={row.original} />
                                ),
                              })
                            }
                            variant="ghost"
                            size="icon"
                            aria-label={`Ver detalles de ${row.original.orderId}`}
                          >
                            <Search className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ver Detalles</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip delayDuration={1000}>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() =>
                              openDialog({
                                title: "Marcar pedido como enviado",
                                description: `Ingrese los detalles del envío para el pedido ${row.original.orderId}`,
                                content: () => (
                                  <MarkAsShippedForm order={row.original} />
                                ),
                              })
                            }
                            variant="ghost"
                            size="icon"
                            aria-label={`Marcar como enviado ${row.original.orderId}`}
                            disabled={
                              row.original.orderStatus === "enviado" ||
                              row.original.orderStatus === "entregado" ||
                              row.original.orderStatus === "cancelado" ||
                              row.original.paymentStatus !== "aprobado"
                            }
                          >
                            <Truck className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Marcar como Enviado</p>
                        </TooltipContent>
                      </Tooltip>

                      <DataTableActions order={row.original} />
                    </div>
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
                    ? "Cargando pedidos..."
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
