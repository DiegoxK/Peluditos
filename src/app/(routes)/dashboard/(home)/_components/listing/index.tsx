"use client";

import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Cat, Dog, Squirrel } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";

export default function PetListing() {
  const [pets] = api.pets.getAllPets.useSuspenseQuery();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle className="text-primary flex items-center gap-2">
            <Cat strokeWidth={2.2} />
            <span className="font-semibold">Total de Mascotas</span>
          </CardTitle>
          <div className="mx-4">
            <Separator className="bg-input" />
          </div>
          <CardContent className="px-4">
            <div className="text-primary text-2xl font-bold">{pets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardTitle className="text-primary flex items-center gap-2">
            <Squirrel strokeWidth={2.2} />
            <span className="font-semibold">Disponibles para Adopción</span>
          </CardTitle>
          <div className="mx-4">
            <Separator className="bg-input" />
          </div>
          <CardContent className="px-4">
            <div className="text-primary text-2xl font-bold">
              {pets.filter((m) => m.status === "disponible").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardTitle className="text-primary flex items-center gap-2">
            <Dog strokeWidth={2.2} />
            <span className="font-semibold">Adoptadas</span>
          </CardTitle>
          <div className="mx-4">
            <Separator className="bg-input" />
          </div>
          <CardContent className="px-4">
            <div className="text-primary text-2xl font-bold">
              {pets.filter((m) => m.status === "adoptado").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-sidebar border-sidebar-border space-y-4 border p-4">
        <DataTable columns={columns} data={pets} />
      </div>
    </>
  );
}
