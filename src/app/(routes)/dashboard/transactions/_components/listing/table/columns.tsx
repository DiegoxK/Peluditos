"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "ID",
    cell: ({ row }) => {
      const { orderId } = row.original;
      return <span className="text-primary font-semibold">{orderId}</span>;
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "customer",
    header: "Cliente",
    cell: ({ row }) => {
      const { customer } = row.original;
      return (
        <div>
          <div className="font-medium">{customer.name}</div>
          <div className="text-muted-foreground text-xs">{customer.email}</div>
        </div>
      );
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return <span>{formatDate(createdAt)}</span>;
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const { total } = row.original;
      return <span>{formatPrice(total)}</span>;
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Estado Pago",
    cell: ({ row }) => {
      const { paymentStatus } = row.original;
      return (
        <Badge
          variant={
            paymentStatus === "aprobado"
              ? "secondary"
              : paymentStatus === "rechazado"
                ? "destructive"
                : "outline"
          }
          className="capitalize"
        >
          {paymentStatus}
        </Badge>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "orderStatus",
    header: "Estado Pedido",
    cell: ({ row }) => {
      const { orderStatus } = row.original;
      return <span className="capitalize">{orderStatus}</span>;
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "shipping",
    header: "Envío",
    cell: ({ row }) => {
      const { shipping } = row.original;
      return (
        <div>
          <div className="font-medium">{shipping.company}</div>
          <div className="text-muted-foreground text-xs">{shipping.code}</div>
        </div>
      );
    },
  },
];
