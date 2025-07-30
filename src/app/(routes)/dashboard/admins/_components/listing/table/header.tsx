"use client";

import { Button } from "@/components/ui/button";
import type { User } from "@/server/db/schema";
import type { Table } from "@tanstack/react-table";
import { CircleX, Download, ListRestart, Loader2, Plus } from "lucide-react";
import CreateUserForm from "./_components/create-user-form";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";
import { exportToExcel } from "@/lib/utils";
import { MultiSelectFilter } from "@/components/ui/multi-select-filter";
import { userSortGroups } from "./sort-groups";
import { Input } from "@/components/ui/input";
import { SortMenu } from "@/components/ui/sort-menu";
import { toast } from "sonner";

interface DataTableHeaderProps {
  table: Table<User>;
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

  const roleColumn = table.getColumn("role");

  const roles = [
    { label: "Admin", value: "ADMIN" },
    { label: "Editor", value: "EDITOR" },
    { label: "Solo Lectura", value: "READONLY" },
  ];

  const handleExport = () => {
    const dataToExport = table.getFilteredRowModel().rows.map((row) => ({
      ID: row.original._id,
      Nombre: row.original.name,
      Correo: row.original.email,
      Rol: row.original.role,
    }));

    if (dataToExport.length > 0) {
      exportToExcel(dataToExport, "usuarios.xlsx");
    } else {
      toast.error("No hay datos para exportar en la vista actual.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-primary text-2xl font-semibold">
            Listado de Usuarios
          </h2>
          <span className="text-muted-foreground">
            {rowCount} usuario(s) encontrado(s)
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
              title: "Nuevo Usuario",
              description:
                "Complete los detalles para crear un nuevo usuario para el dashboard.",
              content: () => <CreateUserForm />,
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="flex w-full items-center gap-2">
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar por nombre o correo electrónico..."
          className="bg-background w-full rounded-md border px-4 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {roleColumn && (
            <MultiSelectFilter
              column={roleColumn}
              title="Rol"
              options={roles}
            />
          )}
          <SortMenu table={table} sortGroups={userSortGroups} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={!canClear}
            variant="outline"
            size="sm"
            onClick={resetTableToDefaults}
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
