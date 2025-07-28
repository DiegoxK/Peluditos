"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialog } from "@/context/dialog-provider";
import type { Order } from "@/server/db/schema";
import { MoreHorizontal } from "lucide-react";
import OrderDetails from "./_components/order-details";
import EditOrderNotesForm from "./_components/edit-order-notes-form";

interface DataTableActionsProps {
  order: Order;
}

export default function DataTableActions({ order }: DataTableActionsProps) {
  const { openDialog } = useDialog();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            openDialog({
              title: `Detalles del Pedido ${order.orderId}`,
              description: "Información completa del pedido, cliente y envío.",
              content: () => <OrderDetails order={order} />,
            })
          }
        >
          Ver detalles
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            openDialog({
              title: "Editar observaciones",
              description: `Añade o modifica las notas internas para el pedido ${order.orderId}.`,
              content: () => <EditOrderNotesForm order={order} />,
            })
          }
        >
          Editar observaciones
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Enviar confirmación por WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Enviar confirmación por correo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
