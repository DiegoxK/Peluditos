"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";
import type { Order } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

interface EditOrderNotesProps {
  order: Order;
}

export default function EditOrderNotesForm({ order }: EditOrderNotesProps) {
  const { closeDialog, setPreventDialogClose } = useDialog();
  const { currentQueryInput } = useTableState();
  const utils = api.useUtils();
  const [notes, setNotes] = useState(order.notes ?? "");

  const { mutate: updateNotes, isPending } =
    api.orders.updateOrderNotes.useMutation({
      onMutate: async (newData) => {
        setPreventDialogClose(true);
        await utils.orders.getAllOrders.cancel(currentQueryInput);

        const previousOrdersResponse =
          utils.orders.getAllOrders.getData(currentQueryInput);

        utils.orders.getAllOrders.setData(currentQueryInput, (oldResponse) => {
          if (!oldResponse) return undefined;
          return {
            ...oldResponse,
            data: oldResponse.data.map((o) =>
              o._id === newData._id ? { ...o, notes: newData.notes } : o,
            ),
          };
        });

        return { previousOrdersResponse, queryInputUsed: currentQueryInput };
      },
      onError: (error, _variables, context) => {
        if (context?.previousOrdersResponse) {
          utils.orders.getAllOrders.setData(
            context.queryInputUsed,
            context.previousOrdersResponse,
          );
        }
        toast.error(`Error actualizando las observaciones: ${error.message}`);
      },
      onSettled: () => {
        void utils.orders.getAllOrders.invalidate(currentQueryInput);
        setPreventDialogClose(false);
      },
      onSuccess: () => {
        toast.success("Observaciones actualizadas correctamente.");
        closeDialog();
      },
    });

  const handleSave = () => {
    updateNotes({ _id: order._id, notes });
  };

  return (
    <>
      <div className="grid gap-2 py-4">
        <Label htmlFor="notes">Observaciones del Pedido</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Añadir notas internas sobre el pedido..."
          className="min-h-[100px]"
          disabled={isPending}
        />
      </div>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline" type="button" disabled={isPending}>
            Cancelar
          </Button>
        </DialogClose>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </DialogFooter>
    </>
  );
}
