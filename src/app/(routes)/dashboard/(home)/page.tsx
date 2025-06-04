import { api, HydrateClient } from "@/trpc/server";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PetListing from "./_components/listing";

import { TableStateProvider } from "@/context/table-state-provider";

import { defaultInitialTableQueryInput } from "@/config/pet-defaults";

export default async function PetsPage() {
  void api.pets.getAllPets.prefetch(defaultInitialTableQueryInput);

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
          <TableStateProvider>
            <TabsContent value="listado" className="space-y-4">
              <PetListing />
            </TabsContent>
            <TabsContent value="estadisticas" className="space-y-4">
              {/* <PetStats pets={data} /> */}
            </TabsContent>
          </TableStateProvider>
        </HydrateClient>
      </Tabs>
    </div>
  );
}
