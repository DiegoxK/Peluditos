"use client";

import { Button } from "@/components/ui/button";
import type { Product } from "@/server/db/schema";
import type { Table } from "@tanstack/react-table";
import { CircleX, Download, ListRestart, Loader2, Plus } from "lucide-react";
import CreateProductForm from "./_components/create-product-form";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";
import { exportToExcel } from "@/lib/utils";
import { MultiSelectFilter } from "@/components/ui/multi-select-filter";
import { productSortGroups } from "./sort-groups";
import { Input } from "@/components/ui/input";
import { SortMenu } from "@/components/ui/sort-menu";
import { api } from "@/trpc/react";

interface DataTableHeaderProps {
  table: Table<Product>;
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

  const categoryColumn = table.getColumn("category");
  const featuredColumn = table.getColumn("featured");

  const { data: categories, isPending } = api.categories.getAll.useQuery();

  const states = [
    { label: "Destacado", value: "true" },
    { label: "Normal", value: "false" },
  ];

  const handleExport = () => {
    const dataToExport = table.options.data;
    if (dataToExport && dataToExport.length > 0) {
      exportToExcel(dataToExport, "productos.xlsx");
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
            Listado de Productos
          </h2>
          <span className="text-muted-foreground">
            {rowCount} producto(s) encontrado(s)
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
        <Button
          onClick={() =>
            openDialog({
              title: "Nuevo Producto",
              description:
                "Complete los detalles del producto y guarde los cambios.",
              content: () => <CreateProductForm />,
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="flex w-full items-center gap-2">
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar por nombre, categoría o subcategoría..."
          className="bg-background w-full rounded-md border px-4 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {categoryColumn && (
            <MultiSelectFilter
              disabled={isPending}
              column={categoryColumn}
              title="Categoría"
              options={
                categories
                  ? categories.map((c) => ({ label: c.label, value: c.id }))
                  : []
              }
            />
          )}
          {featuredColumn && (
            <MultiSelectFilter
              column={featuredColumn}
              title="Estado"
              options={states}
            />
          )}
          <SortMenu table={table} sortGroups={productSortGroups} />
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
