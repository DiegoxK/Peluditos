import { api, HydrateClient } from "@/trpc/server";
import PetsView from "./_components/pets-view";

export default function AdoptionPage() {
  void api.pets.getPublicPets.prefetch({ pageIndex: 0, pageSize: 9 });

  return (
    <>
      <h1 className="bg-primary mt-2 w-full py-8 text-center text-3xl font-medium text-white">
        Adopción de mascotas
      </h1>
      <div className="container mx-auto flex">
        <HydrateClient>
          <PetsView />
        </HydrateClient>
      </div>
    </>
  );
}
