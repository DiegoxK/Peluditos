"use client";

import { api } from "@/trpc/react";

export default function PetStats() {
  const [petStats] = api.pets.getStats.useSuspenseQuery();

  return (
    <>
      <div className="grid grid-cols-3 gap-6">stats</div>
    </>
  );
}
