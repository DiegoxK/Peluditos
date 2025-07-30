import { api, HydrateClient } from "@/trpc/server";

import { Separator } from "@/components/ui/separator";

import { TableStateProvider } from "@/context/table-state-provider";

import { defaultInitialTableQueryInput } from "@/config/filter-defaults";
import { DialogProvider } from "@/context/dialog-provider";

import ProductListing from "./_components/listing";
import { SessionProvider } from "next-auth/react";

export default async function UsersPage() {
  void api.users.getAllUsers.prefetch(defaultInitialTableQueryInput);

  return (
    <SessionProvider>
      <div className="container mx-auto p-6">
        <h1 className="text-primary text-3xl font-bold tracking-tight">
          Gestión de Usuarios
        </h1>
        <p className="text-muted-foreground">
          Administra los usuarios del dashboard
        </p>

        <div className="my-4">
          <Separator className="bg-input" />
        </div>

        <HydrateClient>
          <TableStateProvider>
            <DialogProvider>
              <ProductListing />
            </DialogProvider>
          </TableStateProvider>
        </HydrateClient>
      </div>
    </SessionProvider>
  );
}
