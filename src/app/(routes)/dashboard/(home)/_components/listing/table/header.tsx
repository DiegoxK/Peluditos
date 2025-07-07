"use client";

import { Button } from "@/components/ui/button";

import type { Pet } from "@/server/db/schema";
import type { Table } from "@tanstack/react-table";
import { CircleX, Download, ListRestart, Loader2, Plus } from "lucide-react";

import CreatePetForm from "./_components/create-pet-form";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";
import { exportToExcel } from "@/lib/utils";
import { MultiSelectFilter } from "@/components/ui/multi-select-filter";
import { SortMenu } from "@/components/ui/sort-menu";
import { petSortGroups } from "./sort-groups";
import { Input } from "@/components/ui/input";

interface DataTableHeaderProps {
  table: Table<Pet>;
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

  const specieColumn = table.getColumn("specie");
  const statusColumn = table.getColumn("status");

  const especies = ["perro", "gato"] as const;
  const estados = ["adoptado", "disponible", "en tratamiento"] as const;

  const handleExport = () => {
    const dataToExport = table.options.data;
    if (dataToExport && dataToExport.length > 0) {
      exportToExcel(dataToExport, "mascotas.xlsx");
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
            Listado de Mascotas
          </h2>
          <span className="text-muted-foreground">
            {rowCount} mascota(s) encontrada(s)
          </span>
        </div>
        {feedbackState && (
          <div className="text-primary mr-8 flex gap-2">
            <Loader2 className="animate-spin" />
            <span>{feedbackState}</span>
          </div>
        )}
        {isError && (
          <div className="text-destructive mr-8 flex gap-2">
            <CircleX />
            <span>{isError}</span>
          </div>
        )}
        <Button
          onClick={() =>
            openDialog({
              title: "Nueva Mascota",
              description:
                "Complete los detalles de la mascota y guarde los cambios.",
              content: () => <CreatePetForm />,
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Mascota
        </Button>
      </div>

      <div className="flex w-full items-center gap-2">
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar por nombre, raza o especie..."
          className="bg-background w-full rounded-md border px-4 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {specieColumn && (
            <MultiSelectFilter
              column={specieColumn}
              title="Especie"
              options={especies}
            />
          )}
          {statusColumn && (
            <MultiSelectFilter
              column={statusColumn}
              title="Estado"
              options={estados}
            />
          )}
          <SortMenu table={table} sortGroups={petSortGroups} />
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
            Exportar exel
          </Button>
        </div>
      </div>
    </div>
  );
}
