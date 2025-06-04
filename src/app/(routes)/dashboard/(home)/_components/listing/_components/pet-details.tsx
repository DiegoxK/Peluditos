import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useDialog } from "@/context/dialog-provider";
import { formatDate } from "@/lib/utils";
import type { Pet } from "@/server/db/schema";
import Image from "next/image";
import CreatePetForm from "./create-pet-form";
import { Loader2 } from "lucide-react";

interface PetDetailsProps {
  pet: Pet;
}

export default function PetDetails({ pet }: PetDetailsProps) {
  const { openDialog, closeDialog } = useDialog();

  return (
    <div>
      <div className="grid max-h-[60vh] gap-6 space-y-4 overflow-y-scroll py-4 ps-1 pr-2">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="bg-accent relative ml-2 flex size-[128px] w-fit items-center overflow-hidden rounded-full">
            <Loader2 className="absolute inset-1/2 size-8 -translate-1/2 animate-spin text-white/80" />
            <Image
              src={pet.image}
              alt={pet.name}
              width={128}
              height={128}
              className="relative rounded-full object-cover"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-bold">{pet.name}</h3>
            <p className="text-muted-foreground">
              {pet.specie} - {pet.breed}
            </p>
            <Badge
              variant={
                pet.status === "disponible"
                  ? "default"
                  : pet.status === "adoptado"
                    ? "secondary"
                    : pet.status === "en tratamiento"
                      ? "outline"
                      : "destructive"
              }
            >
              {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium">Información Básica</h4>
            <div className="rounded-md border p-3">
              <div className="grid gap-1">
                <div className="grid grid-cols-2">
                  <span className="text-sm font-medium">Edad:</span>
                  <span className="text-sm">
                    {pet.age} {pet.age === 1 ? "año" : "años"}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm font-medium">Sexo:</span>
                  <span className="text-sm">{pet.gender}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm font-medium">Peso:</span>
                  <span className="text-sm">{pet.weight} kg</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm font-medium">Fecha de Ingreso:</span>
                  <span className="text-sm">{formatDate(pet.entryDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Status de Salud</h4>
            <div className="rounded-md border p-3">
              <div className="grid gap-1">
                <div className="grid grid-cols-2">
                  <span className="text-sm font-medium">Vacunado:</span>
                  <span className="text-sm">
                    {pet.vaccinated ? "Sí" : "No"}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm font-medium">Esterilizado:</span>
                  <span className="text-sm">
                    {pet.sterilized ? "Sí" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Descripción</h4>
          <div className="rounded-md border p-3">
            <p className="text-sm">
              {pet.description || "No hay descripción disponible."}
            </p>
          </div>
        </div>
      </div>
      <DialogFooter className="mt-4">
        <Button
          onClick={() =>
            openDialog({
              title: `Editar a ${pet.name}`,
              description:
                "Complete los detalles de la mascota y guarde los cambios.",
              content: () => <CreatePetForm pet={pet} />,
            })
          }
        >
          Editar
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Cerrar</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}
