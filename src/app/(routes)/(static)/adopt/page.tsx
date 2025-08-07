import { api, HydrateClient } from "@/trpc/server";
import {
  DEFAULT_FILTERS,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "@/config/pet-defaults";

import PetsView from "./_components/pets-view";

export const dynamic = "force-dynamic";

export default async function AdoptionPage() {
  await api.pets.getPublicPets.prefetch({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    ...DEFAULT_FILTERS,
  });

  return (
    <>
      <h1 className="bg-primary w-full py-8 text-center text-3xl font-medium text-white">
        Adopción de mascotas
      </h1>
      <div className="container mx-auto">
        <HydrateClient>
          <PetsView />
        </HydrateClient>
      </div>
    </>
  );
}
