"use client";

import { api } from "@/trpc/react";
import Sidebar from "./sidebar";

export default function PetsView() {
  const [pets] = api.pets.getPublicPets.useSuspenseQuery({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <>
      <Sidebar />
      <main className="p-4">
        <h2 className="mb-4 text-2xl font-semibold">Mascotas disponibles</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <div key={pet._id} className="rounded-lg border p-4">
              <h3 className="text-xl font-bold">{pet.name}</h3>
              <p>{pet.description}</p>
              <p className="text-sm text-gray-500">Edad: {pet.age} años</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
