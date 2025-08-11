import { api, HydrateClient } from "@/trpc/server";
import {
  DEFAULT_FILTERS,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "@/config/pet-defaults";

import PetsView from "./_components/pets-view";

export const dynamic = "force-dynamic";

export default async function AdoptionPage() {
  void api.pets.getPublicPets.prefetch({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    ...DEFAULT_FILTERS,
  });

  return (
    <>
      <div className="bg-primary">
        <div className="space-y-2 px-4 py-12 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight">
            Adopción de mascotas
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Encuentra a tu nuevo mejor amigo y dale un hogar lleno de amor
          </p>
        </div>
      </div>

      <div className="container mx-auto">
        <HydrateClient>
          <PetsView />
        </HydrateClient>
      </div>
    </>
  );
}
