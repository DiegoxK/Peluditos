"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: () => {
      return <span className="pl-3">Imagen</span>;
    },
    cell: ({ row }) => {
      const { image, name } = row.original;
      return (
        <div className="bg-accent ml-5 flex size-[35px] w-fit items-center overflow-hidden rounded-md">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={35}
              height={35}
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gray-200 text-xs text-gray-500">
              No img
            </div>
          )}
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
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => {
      const { category } = row.original;
      return <span className="capitalize">{category}</span>;
    },
    enableColumnFilter: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      const { price } = row.original;
      return <span>{formatPrice(price)}</span>;
    },
    enableGlobalFilter: false,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const { stock } = row.original;
      return <span>{stock}</span>;
    },
    enableGlobalFilter: false,
  },
  {
    accessorKey: "sales",
    header: "Ventas",
    cell: ({ row }) => {
      const { sales } = row.original;
      return <span>{sales}</span>;
    },
    enableGlobalFilter: false,
  },
  {
    accessorKey: "featured",
    header: "Estado",
    cell: ({ row }) => {
      const { featured } = row.original;
      return (
        <Badge variant={featured ? "default" : "outline"}>
          {featured ? "Destacado" : "Normal"}
        </Badge>
      );
    },
    enableColumnFilter: true,
    enableGlobalFilter: false,
  },
];
