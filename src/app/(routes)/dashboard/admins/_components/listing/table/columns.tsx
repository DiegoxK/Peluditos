"use client";

import { Badge } from "@/components/ui/badge";
import type { User } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { User2 } from "lucide-react";
import Image from "next/image";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "image",
    header: () => {
      return <span className="pl-3">Avatar</span>;
    },
    cell: ({ row }) => {
      const { image, name } = row.original;
      return (
        <div className="bg-secondary ml-3 flex size-[35px] w-fit items-center justify-center overflow-hidden rounded-full">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={35}
              height={35}
              className="object-cover"
            />
          ) : (
            <User2 className="text-muted-foreground size-5" />
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
    accessorKey: "email",
    header: "Correo Electrónico",
    cell: ({ row }) => {
      const { email } = row.original;
      return <span className="text-muted-foreground">{email}</span>;
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const { role } = row.original;
      return (
        <Badge
          variant={
            role === "ADMIN"
              ? "default"
              : role === "EDITOR"
                ? "secondary"
                : "outline"
          }
          className="capitalize"
        >
          {role.toLowerCase()}
        </Badge>
      );
    },
    enableColumnFilter: true,
    enableGlobalFilter: false,
  },
];
