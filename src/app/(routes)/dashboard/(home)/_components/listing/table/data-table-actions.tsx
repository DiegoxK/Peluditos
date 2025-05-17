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
              title: "Delete Account?",
              description: "This action cannot be undone.",
              content: (
                <div className="space-y-4">
                  <p>Are you really sure you want to delete your account?</p>
                  <Button variant="destructive">Yes, delete it</Button>
                </div>
              ),
            })
          }
        >
          Ver detalles
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>Editar</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {}}
          className="text-destructive focus:text-destructive focus:bg-red-100"
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
