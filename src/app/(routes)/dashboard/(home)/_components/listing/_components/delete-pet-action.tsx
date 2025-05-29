"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import type { Pet } from "@/server/db/schema";
import { api } from "@/trpc/react";

interface DeletePetProps {
  pet: Pet;
}

export default function DeletePetAction({ pet }: DeletePetProps) {
  const { mutate: deletePet } = api.pets.deletePet.useMutation();

  const handleDelete = () => {
    deletePet(
      { _id: pet._id },
      {
        onSuccess: () => {
          console.log("Pet deleted successfully");
        },
        onError: (error) => {
          console.error("Error deleting pet:", error);
        },
      },
    );
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
