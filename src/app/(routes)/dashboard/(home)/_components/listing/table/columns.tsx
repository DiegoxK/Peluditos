"use client";

import type { Pet } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Pet>[] = [
  {
    accessorKey: "image",
    header: "Imagen",
    enableGlobalFilter: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "name",
    header: "Nombre",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "specie",
    header: "Especie",
    enableColumnFilter: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "breed",
    header: "Raza",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "age",
    header: "Edad",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "status",
    header: "Estado",
    enableColumnFilter: true,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "entryDate",
    header: "Fecha Ingreso",
    enableGlobalFilter: false,
  },
];
