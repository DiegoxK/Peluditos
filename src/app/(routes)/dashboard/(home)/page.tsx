import { api } from "@/trpc/server";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PetListing from "./_components/listing";
import PetStats from "./_components/stats";

export default async function Pets() {
  const data = await api.pet.getAllPets();

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

        <TabsContent value="listado" className="space-y-4">
          <PetListing pets={data} />
        </TabsContent>
        <TabsContent value="estadisticas" className="space-y-4">
          <PetStats pets={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
