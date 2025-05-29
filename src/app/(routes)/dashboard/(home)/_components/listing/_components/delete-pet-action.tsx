"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import type { Pet } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface DeletePetProps {
  pet: Pet;
}

export default function DeletePetAction({ pet }: DeletePetProps) {
  const utils = api.useUtils();

  const { mutate: deletePet } = api.pets.deletePet.useMutation({
    onMutate: async ({ _id }) => {
      await utils.pets.getAllPets.cancel();

      const previousPets = utils.pets.getAllPets.getData();

      utils.pets.getAllPets.setData(
        undefined,
        (old) => old?.filter((p) => p._id !== _id) ?? [],
      );

      return { previousPets };
    },

    onError: (error, _variables, context) => {
      if (context?.previousPets) {
        utils.pets.getAllPets.setData(undefined, context.previousPets);
      }
      console.error("Error deleting pet:", error);
      toast.error("Error deleting pet", {
        duration: 3000,
      });
    },

    onSuccess: () => {
      console.log("Pet deleted successfully");
    },

    onSettled: () => {
      void utils.pets.getAllPets.invalidate();
      toast.success("Mascota eliminada exitosamente!", {
        duration: 3000,
      });
    },
  });

  const handleDelete = () => {
    deletePet({ _id: pet._id });
  };

  return (
    <DialogFooter className="mt-4">
      <DialogClose asChild>
        <Button variant="outline">Cerrar</Button>
      </DialogClose>
      <Button onClick={handleDelete} variant="destructive">
        Eliminar
      </Button>
    </DialogFooter>
  );
}
