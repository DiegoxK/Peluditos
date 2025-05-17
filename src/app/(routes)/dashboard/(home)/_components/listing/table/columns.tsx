"use client";

import type { Pet } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Pet>[] = [
  {
    accessorKey: "image",
    header: "Imagen",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "specie",
    header: "Especie",
  },
  {
    accessorKey: "breed",
    header: "Raza",
  },
  {
    accessorKey: "age",
    header: "Edad",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "entryDate",
    header: "Fecha Ingreso",
  },
  // {
  //   accessorKey: "",
  //   header: "actions",
  // },
];
