import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Pet } from "@/server/db/schema";
import type { Table } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Filter,
  Plus,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import CreatePetForm from "../_components/create-pet-form";
import { useDialog } from "@/context/dialog-provider";
import { exportToExcel } from "@/lib/utils";

interface DataTableHeaderProps<TData extends Pet> {
  data: Pet[];
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  table: Table<TData>;
}

export default function DataTableHeader<TData extends Pet>({
  data,
  globalFilter,
  setGlobalFilter,
  table,
}: DataTableHeaderProps<TData>) {
  const { openDialog } = useDialog();

  const specieColumn = table.getColumn("specie");
  const statusColumn = table.getColumn("status");

  const especies = ["perro", "gato"];

  const estados = ["adoptado", "disponible", "en tratamiento"];

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-primary text-2xl font-semibold">
            Listado de Mascotas
          </h2>
          <span className="text-muted-foreground">
            {data.length} mascotas encontradas
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
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar por nombre, raza o especie..."
          className="bg-background w-full rounded-md border px-4 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between">
        {/* Filtrar por Especie */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar por Especie
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {especies.map((especie) => {
                const selected = specieColumn?.getFilterValue() === especie;
                return (
                  <DropdownMenuCheckboxItem
                    key={especie}
                    checked={selected}
                    className="capitalize"
                    onCheckedChange={(checked) => {
                      specieColumn?.setFilterValue(
                        checked ? especie : undefined,
                      );
                    }}
                  >
                    {especie}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filtrar por Estado */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar por Estado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {estados.map((estado) => {
                const selected = statusColumn?.getFilterValue() === estado;
                return (
                  <DropdownMenuCheckboxItem
                    key={estado}
                    className="capitalize"
                    checked={selected}
                    onCheckedChange={(checked) => {
                      statusColumn?.setFilterValue(
                        checked ? estado : undefined,
                      );
                    }}
                  >
                    {estado}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

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
              <div className="mx-2">
                <DropdownMenuSeparator />
              </div>

              <DropdownMenuItem
                className="group"
                onClick={() =>
                  table.setSorting([{ id: "status", desc: false }])
                }
              >
                Estado (
                <ArrowUp className="text-black group-focus:text-white" />)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="group"
                onClick={() => table.setSorting([{ id: "status", desc: true }])}
              >
                Estado ({" "}
                <ArrowDown className="text-black group-focus:text-white" />)
              </DropdownMenuItem>
              <div className="mx-2">
                <DropdownMenuSeparator />
              </div>
              <DropdownMenuItem
                onClick={() => table.setSorting([{ id: "age", desc: false }])}
              >
                Edad (menor a mayor)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.setSorting([{ id: "age", desc: true }])}
              >
                Edad (mayor a menor)
              </DropdownMenuItem>
              <div className="mx-2">
                <DropdownMenuSeparator />
              </div>
              <DropdownMenuItem
                onClick={() =>
                  table.setSorting([{ id: "entryDate", desc: true }])
                }
              >
                Más recientes primero
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.setSorting([{ id: "entryDate", desc: false }])
                }
              >
                Más antiguos primero
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToExcel(data, "mascotas.xlsx")}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setGlobalFilter("");
              table.resetSorting();
              table.resetColumnFilters();
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    </>
  );
}
