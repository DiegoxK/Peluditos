import { api, HydrateClient } from "@/trpc/server";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TableStateProvider } from "@/context/table-state-provider";

import { defaultInitialTableQueryInput } from "@/config/filter-defaults";
import { DialogProvider } from "@/context/dialog-provider";

import OrderListing from "./_components/listing";
import OrderStats from "./_components/stats";

export default async function TransactionsPage() {
  void api.orders.getAllOrders.prefetch(defaultInitialTableQueryInput);
  void api.orders.getDashboardSummary.prefetch();
  void api.orders.getStats.prefetch();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-primary text-3xl font-bold tracking-tight">
        Gestión de Pedidos
      </h1>
      <p className="text-muted-foreground">
        Administra y da seguimiento a los pedidos de tus clientes
      </p>

      <div className="my-4">
        <Separator className="bg-input" />
      </div>

      <Tabs defaultValue="listado" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listado">Pedidos</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <HydrateClient>
          <TableStateProvider>
            <DialogProvider>
              <TabsContent value="listado" className="space-y-4">
                <OrderListing />
              </TabsContent>
              <TabsContent value="estadisticas" className="space-y-4">
                <OrderStats />
              </TabsContent>
            </DialogProvider>
          </TableStateProvider>
        </HydrateClient>
      </Tabs>
    </div>
  );
}
