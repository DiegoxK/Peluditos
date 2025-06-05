"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import type { Pet } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";

interface DeletePetProps {
  pet: Pet;
}

export default function DeletePetAction({ pet }: DeletePetProps) {
  const { closeDialog: closeParentDialog, setPreventDialogClose } = useDialog();
  const { currentQueryInput } = useTableState();
  const utils = api.useUtils();

  const { mutate: deletePet, isPending: isDeleting } =
    api.pets.deletePet.useMutation({
      onMutate: async ({ _id }) => {
        await utils.pets.getAllPets.cancel(currentQueryInput);

        const previousPetsResponse =
          utils.pets.getAllPets.getData(currentQueryInput);

        utils.pets.getAllPets.setData(currentQueryInput, (oldResponse) => {
          if (!oldResponse) return undefined;
          return {
            ...oldResponse,
            data: oldResponse.data.filter((p) => p._id !== _id),
            totalRowCount: Math.max(0, oldResponse.totalRowCount - 1),
          };
        });

        return { previousPetsResponse, queryInputUsed: currentQueryInput };
      },
      onError: (error, _variables, context) => {
        if (context?.previousPetsResponse) {
          utils.pets.getAllPets.setData(
            context.queryInputUsed,
            context.previousPetsResponse,
          );
        }
        console.error("Error deleting pet:", error);
        toast.error(`Error eliminando mascota: ${error.message}`, {
          duration: 3000,
        });
      },
      onSuccess: () => {
        console.log("Pet deleted successfully");
      },
      onSettled: (_data, error, _variables) => {
        void utils.pets.getAllPets.invalidate();

        if (!error) {
          toast.success("Mascota eliminada exitosamente!", {
            duration: 3000,
          });
          setPreventDialogClose(false);
          closeParentDialog();
        }
      },
    });

  const handleDelete = () => {
    setPreventDialogClose(true);
    deletePet({ _id: pet._id });
  };

  return (
    <DialogFooter className="mt-4">
      <DialogClose asChild>
        <Button variant="outline" type="button" disabled={isDeleting}>
          Cancelar
        </Button>
      </DialogClose>
      <Button
        onClick={handleDelete}
        variant="destructive"
        disabled={isDeleting}
      >
        {isDeleting ? "Eliminando..." : "Eliminar"}
      </Button>
    </DialogFooter>
  );
}
