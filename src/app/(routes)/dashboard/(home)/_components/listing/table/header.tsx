"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Pet } from "@/server/db/schema";
import type { Table } from "@tanstack/react-table";
import { ArrowUpDown, Download, Filter, ListRestart, Plus } from "lucide-react";

import CreatePetForm from "../_components/create-pet-form";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";
import { exportToExcel } from "@/lib/utils";

interface DataTableHeaderProps {
  table: Table<Pet>;
  rowCount: number;
}

export default function DataTableHeader({
  table,
  rowCount,
}: DataTableHeaderProps) {
  const { openDialog } = useDialog();

  const { globalFilter, setGlobalFilter, resetTableToDefaults } =
    useTableState();

  const specieColumn = table.getColumn("specie");
  const statusColumn = table.getColumn("status");

  const especies = ["perro", "gato"];
  const estados = ["adoptado", "disponible", "en tratamiento"];

  const handleMultiSelectFilterChange = (
    columnId: string,
    value: string,
    isChecked: boolean,
  ) => {
    const column = table.getColumn(columnId);
    if (!column) return;

    const currentFilter =
      (column.getFilterValue() as string[] | undefined) ?? [];
    let newFilter: string[];

    if (isChecked) {
      newFilter = [...new Set([...currentFilter, value])];
    } else {
      newFilter = currentFilter.filter((v) => v !== value);
    }
    column.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
  };

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
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar por nombre, raza o especie..."
          className="bg-background w-full rounded-md border px-4 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {specieColumn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Especie
                  {((specieColumn.getFilterValue() as string[])?.length ?? 0) >
                    0 && (
                    <span className="bg-primary text-primary-foreground ml-2 rounded-full px-2 py-0.5 text-xs">
                      {(specieColumn.getFilterValue() as string[]).length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel>Filtrar por Especie</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {especies.map((especie) => {
                  const selectedValues =
                    (specieColumn.getFilterValue() as string[] | undefined) ??
                    [];
                  const isSelected = selectedValues.includes(especie);
                  return (
                    <DropdownMenuCheckboxItem
                      key={especie}
                      checked={isSelected}
                      className="capitalize"
                      onCheckedChange={(checked) => {
                        handleMultiSelectFilterChange(
                          "specie",
                          especie,
                          !!checked,
                        );
                      }}
                    >
                      {especie}
                    </DropdownMenuCheckboxItem>
                  );
                })}
                {((specieColumn.getFilterValue() as string[])?.length ?? 0) >
                  0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => specieColumn.setFilterValue(undefined)}
                      className="text-destructive focus:text-destructive text-xs focus:bg-red-100"
                    >
                      Limpiar filtro de especie
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {statusColumn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Estado
                  {((statusColumn.getFilterValue() as string[])?.length ?? 0) >
                    0 && (
                    <span className="bg-primary text-primary-foreground ml-2 rounded-full px-2 py-0.5 text-xs">
                      {(statusColumn.getFilterValue() as string[]).length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {estados.map((estado) => {
                  const selectedValues =
                    (statusColumn.getFilterValue() as string[] | undefined) ??
                    [];
                  const isSelected = selectedValues.includes(estado);
                  return (
                    <DropdownMenuCheckboxItem
                      key={estado}
                      className="capitalize"
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        handleMultiSelectFilterChange(
                          "status",
                          estado,
                          !!checked,
                        );
                      }}
                    >
                      {estado}
                    </DropdownMenuCheckboxItem>
                  );
                })}
                {((statusColumn.getFilterValue() as string[])?.length ?? 0) >
                  0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => statusColumn.setFilterValue(undefined)}
                      className="text-destructive focus:text-destructive text-xs focus:bg-red-100"
                    >
                      Limpiar filtro de estado
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => table.setSorting([{ id: "name", desc: false }])}
              >
                Nombre (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.setSorting([{ id: "name", desc: true }])}
              >
                Nombre (Z-A)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  table.setSorting([{ id: "status", desc: false }])
                }
              >
                Estado (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.setSorting([{ id: "status", desc: true }])}
              >
                Estado (Z-A)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => table.setSorting([{ id: "age", desc: false }])}
              >
                Edad (Menor a Mayor)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.setSorting([{ id: "age", desc: true }])}
              >
                Edad (Mayor a Menor)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  table.setSorting([{ id: "entryDate", desc: true }])
                }
              >
                Más Recientes
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.setSorting([{ id: "entryDate", desc: false }])
                }
              >
                Más Antiguos
              </DropdownMenuItem>
              {table.getState().sorting.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => table.resetSorting()}
                    className="text-destructive focus:text-destructive text-xs focus:bg-red-100"
                  >
                    Limpiar ordenamiento
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar (Página Actual)
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <ListRestart className="mr-2 h-4 w-4" />
            Limpiar Todo
          </Button>
        </div>
      </div>
    </div>
  );
}
