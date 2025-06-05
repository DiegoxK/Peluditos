"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Pet } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<Pet>[] = [
  {
    accessorKey: "image",
    header: () => {
      return <span className="pl-3">Imagen</span>;
    },
    cell: ({ row }) => {
      const { image } = row.original;
      const { name } = row.original;
      return (
        <div className="bg-accent ml-5 flex size-[35px] w-fit items-center overflow-hidden rounded-full">
          <Image src={image} alt={name} width={35} height={35} />
        </div>
      );
    },
    enableGlobalFilter: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const { name } = row.original;
      return <span className="text-primary font-semibold">{name}</span>;
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "specie",
    header: "Especie",
    cell: ({ row }) => {
      const { specie } = row.original;
      return <span className="capitalize">{specie}</span>;
    },
    enableColumnFilter: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "breed",
    header: "Raza",
    cell: ({ row }) => {
      const { breed } = row.original;
      return <span className="capitalize">{breed}</span>;
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "age",
    header: "Edad",
    cell: ({ row }) => {
      const { age } = row.original;
      return (
        <span>
          {age} {age === 1 ? "año" : "años"}
        </span>
      );
    },
    enableGlobalFilter: false,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <Badge
          className="capitalize"
          variant={
            status === "disponible"
              ? "default"
              : status === "adoptado"
                ? "secondary"
                : status === "en tratamiento"
                  ? "outline"
                  : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
    enableColumnFilter: true,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "entryDate",
    header: "Fecha Ingreso",
    cell: ({ row }) => {
      const { entryDate } = row.original;
      return <span>{formatDate(entryDate)}</span>;
    },
    enableGlobalFilter: false,
  },
];
