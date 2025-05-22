"use client";

import { Button } from "@/components/ui/button";

import { useDialog } from "@/context/dialog-provider";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Pet } from "@/server/db/schema";
import { ChevronDown } from "lucide-react";
import PetDetails from "../_components/pet-details";
import DeletePetAction from "../_components/delete-pet-action";
import CreatePetForm from "../_components/create-pet-form";

interface DataTableActionsInterface {
  pet: Pet;
}

export default function DataTableActions({ pet }: DataTableActionsInterface) {
  const { openDialog } = useDialog();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Abrir menú</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            openDialog({
              title: `Detalles de ${pet.name}`,
              description: "Información completa de la mascota",
              content: () => <PetDetails pet={pet} />,
            })
          }
        >
          Ver detalles
        </DropdownMenuItem>
        <DropdownMenuItem
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
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            openDialog({
              title: `Confirmar eliminación de ${pet.name}?`,
              description: `¿Está seguro que desea eliminar a ${pet.name}? Esta acción no se puede deshacer.`,
              content: () => <DeletePetAction pet={pet} />,
            })
          }
          className="text-destructive focus:text-destructive focus:bg-red-100"
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
