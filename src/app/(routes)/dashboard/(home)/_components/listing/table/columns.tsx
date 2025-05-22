"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Pet } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<Pet>[] = [
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({ row }) => {
      const { image } = row.original;
      const { name } = row.original;
      return (
        <div className="bg-accent ml-2 flex size-[35px] w-fit items-center overflow-hidden rounded-full">
          <Image
            src={
              "https://d9kl8ewi09.ufs.sh/f/HkC5qL7fL2Jzu5CSNzBpzFNeaBDdPhftZ9iJsW5R1T8oICYU"
            }
            alt={name}
            width={35}
            height={35}
          />
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
