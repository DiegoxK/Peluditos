import { api, HydrateClient } from "@/trpc/server";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PetListing from "./_components/listing";

import { Suspense } from "react";
import LoadingListing from "./_components/listing/loading";

export default async function Pets() {
  void api.pets.getAllPets.prefetch();

  return (
    <div className="p-6">
      <h1 className="text-primary text-3xl font-bold tracking-tight">
        Gestión de Mascotas
      </h1>
      <p className="text-muted-foreground">
        Administra las mascotas disponibles para adopción
      </p>

      <div className="my-4">
        <Separator className="bg-input" />
      </div>

      <Tabs defaultValue="listado" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listado">Listado de Mascotas</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <HydrateClient>
          <TabsContent value="listado" className="space-y-4">
            <Suspense fallback={<LoadingListing />}>
              <PetListing />
            </Suspense>
          </TabsContent>
          <TabsContent value="estadisticas" className="space-y-4">
            {/* <PetStats pets={data} /> */}
          </TabsContent>
        </HydrateClient>
      </Tabs>
    </div>
  );
}
