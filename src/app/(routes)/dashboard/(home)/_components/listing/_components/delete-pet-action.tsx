import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import type { Pet } from "@/server/db/schema";

interface DeletePetProps {
  pet: Pet;
}

export default function DeletePetAction({ pet }: DeletePetProps) {
  return (
    <DialogFooter className="mt-4">
      <DialogClose asChild>
        <Button variant="outline">Cerrar</Button>
      </DialogClose>
      <Button variant="destructive">Eliminar</Button>
    </DialogFooter>
  );
}
