"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelectFilter } from "@/components/ui/multi-select-filter";
import { SortMenu } from "@/components/ui/sort-menu";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";
import { exportToExcel } from "@/lib/utils";
import type { Order } from "@/server/db/schema";
import type { Table } from "@tanstack/react-table";
import { CircleX, Download, ListRestart, Loader2, Plus } from "lucide-react";
import { orderSortGroups } from "./sort-groups";

interface DataTableHeaderProps {
  table: Table<Order>;
  rowCount: number;
  feedbackState: string | false;
  isError: string | false;
}

export default function DataTableHeader({
  table,
  rowCount,
  feedbackState,
  isError,
}: DataTableHeaderProps) {
  const { openDialog } = useDialog();

  const {
    globalFilter,
    columnFilters,
    sorting,
    setGlobalFilter,
    resetTableToDefaults,
  } = useTableState();

  const hasActiveGlobalFilter = globalFilter.trim() !== "";
  const hasActiveColumnFilters = columnFilters.length > 0;
  const hasActiveSorting = sorting.length > 0;

  const canClear =
    hasActiveGlobalFilter || hasActiveColumnFilters || hasActiveSorting;

  const paymentStatusColumn = table.getColumn("paymentStatus");
  const orderStatusColumn = table.getColumn("orderStatus");

  const paymentStatuses = ["aprobado", "pendiente", "rechazado"] as const;
  const orderStatuses = [
    "enviado",
    "procesando",
    "entregado",
    "cancelado",
  ] as const;

  const handleExport = () => {
    const dataToExport = table.getFilteredRowModel().rows.map((row) => {
      const { customer, shipping, products, ...rest } = row.original;
      return {
        ...rest,
        customerName: customer.name,
        customerEmail: customer.email,
        shippingCompany: shipping.company,
        shippingCode: shipping.code,
        productCount: products.length,
      };
    });

    if (dataToExport.length > 0) {
      exportToExcel(dataToExport, "pedidos.xlsx");
    } else {
      console.log("No data to export for current view.");
    }
  };

  const handleClearAll = () => {
    resetTableToDefaults();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-primary text-2xl font-semibold">
            Listado de Pedidos
          </h2>
          <span className="text-muted-foreground">
            {rowCount} pedido(s) encontrado(s)
          </span>
        </div>
        {feedbackState && (
          <div className="text-primary mr-8 flex items-center gap-2">
            <Loader2 className="animate-spin" />
            <span>{feedbackState}</span>
          </div>
        )}
        {isError && (
          <div className="text-destructive mr-8 flex items-center gap-2">
            <CircleX />
            <span>{isError}</span>
          </div>
        )}
      </div>

      <div className="flex w-full items-center gap-2">
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar por ID, nombre o email del cliente..."
          className="bg-background w-full rounded-md border px-4 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {paymentStatusColumn && (
            <MultiSelectFilter
              column={paymentStatusColumn}
              title="Estado de Pago"
              options={paymentStatuses}
            />
          )}
          {orderStatusColumn && (
            <MultiSelectFilter
              column={orderStatusColumn}
              title="Estado de Pedido"
              options={orderStatuses}
            />
          )}
          <SortMenu table={table} sortGroups={orderSortGroups} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={!canClear}
            variant="outline"
            size="sm"
            onClick={handleClearAll}
          >
            <ListRestart className="mr-2 h-4 w-4" />
            Limpiar Filtros
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>
    </div>
  );
}
