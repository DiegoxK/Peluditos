"use client";

import { api } from "@/trpc/react";
import { AdoptionRadial } from "./_components/adoption-radial";
import { NewPetsAreaChart } from "./_components/new-pets-area-chart";
import { SpeciesPie } from "./_components/species-pie";
import { VaccineRadial } from "./_components/vaccine-radial";

export default function PetStats() {
  const [petStats] = api.pets.getStats.useSuspenseQuery();

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <SpeciesPie species={{ cats: petStats.cats, dogs: petStats.dogs }} />
        <AdoptionRadial total={petStats.total} adopted={petStats.adopted} />
        <VaccineRadial
          total={petStats.total}
          vaccinated={petStats.vaccinated}
        />
      </div>
      <NewPetsAreaChart registry={petStats.registry} />
    </>
  );
}
