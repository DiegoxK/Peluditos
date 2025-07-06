"use client";

import { AdoptionRadial } from "./_components/adoption-radial";
import { NewPetsAreaChart } from "./_components/new-pets-area-chart";
import { SpeciesPie } from "./_components/species-pie";
import { VaccineRadial } from "./_components/vaccine-radial";

export default function PetStats() {
  const petStats = {
    total: 20,
    vaccinated: 20,
    adopted: 5,
    cats: 15,
    dogs: 5,
    registry: {
      2025: [
        { month: "Enero", pets: 0 },
        { month: "Febrero", pets: 0 },
        { month: "Marzo", pets: 237 },
        { month: "Abril", pets: 73 },
        { month: "Mayo", pets: 0 },
        { month: "Junio", pets: 214 },
        { month: "Julio", pets: 300 },
        { month: "Agosto", pets: 250 },
        { month: "Septiembre", pets: 400 },
        { month: "Octubre", pets: 350 },
        { month: "Noviembre", pets: 450 },
        { month: "Diciembre", pets: 500 },
      ],
      2026: [
        { month: "Enero", pets: 50 },
        { month: "Febrero", pets: 0 },
        { month: "Marzo", pets: 0 },
        { month: "Abril", pets: 0 },
        { month: "Mayo", pets: 0 },
        { month: "Junio", pets: 0 },
        { month: "Julio", pets: 0 },
        { month: "Agosto", pets: 0 },
        { month: "Septiembre", pets: 0 },
        { month: "Octubre", pets: 0 },
        { month: "Noviembre", pets: 0 },
        { month: "Diciembre", pets: 0 },
      ],
    },
  };

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
