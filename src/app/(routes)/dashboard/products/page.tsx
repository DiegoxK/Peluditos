import { api, HydrateClient } from "@/trpc/server";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TableStateProvider } from "@/context/table-state-provider";

import { defaultInitialTableQueryInput } from "@/config/filter-defaults";
import { DialogProvider } from "@/context/dialog-provider";

import ProductListing from "./_components/listing";
import ProductStats from "./_components/stats";

export default async function ProductsPage() {
  void api.products.getAllProducts.prefetch(defaultInitialTableQueryInput);
  void api.products.getDashboardSummary.prefetch();
  // void api.products.getStats.prefetch();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-primary text-3xl font-bold tracking-tight">
        Gestión de Productos
      </h1>
      <p className="text-muted-foreground">
        Administra los productos de la tienda
      </p>

      <div className="my-4">
        <Separator className="bg-input" />
      </div>

      <Tabs defaultValue="listado" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listado">Listado de Productos</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <HydrateClient>
          <TableStateProvider>
            <DialogProvider>
              <TabsContent value="listado" className="space-y-4">
                <ProductListing />
              </TabsContent>
              <TabsContent value="estadisticas" className="space-y-4">
                <ProductStats />
              </TabsContent>
            </DialogProvider>
          </TableStateProvider>
        </HydrateClient>
      </Tabs>
    </div>
  );
}
