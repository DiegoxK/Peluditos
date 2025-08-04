"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import Sidebar from "./sidebar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { PetCard } from "./pet-card";

export type Filters = {
  species?: "perro" | "gato";
  ageRanges?: ("cachorro" | "joven" | "adulto" | "senior")[];
  sizes?: ("pequeno" | "mediano" | "grande")[];
  gender?: "macho" | "hembra";
  sortBy?: "newest" | "ageAsc" | "ageDesc";
};

export default function PetsView() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 9;

  const [filters, setFilters] = useState<Filters>({});

  const [data] = api.pets.getPublicPets.useSuspenseQuery({
    pageIndex,
    pageSize,
    ...filters,
  });

  const pets = data.items;
  const totalPets = data.total;
  const totalPages = Math.ceil(totalPets / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageIndex(newPage);
    }
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setPageIndex(0);
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:flex-row md:gap-4">
      <Sidebar onApplyFilters={handleApplyFilters} />
      <main className="w-full space-y-8 rounded-md border bg-white/70 p-4 shadow-sm md:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.length > 0 ? (
            pets.map((pet) => <PetCard key={pet._id} pet={pet} />)
          ) : (
            <div className="text-muted-foreground col-span-full py-24 text-center">
              <h3 className="text-xl font-semibold">
                No se encontraron mascotas
              </h3>
              <p>
                Intenta ajustar tus filtros para encontrar a tu nuevo amigo.
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageIndex - 1);
                  }}
                  className={
                    pageIndex === 0
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
              {/* Simplified pagination links for brevity */}
              <PaginationItem className="hidden md:flex">
                <span className="p-2 text-sm">
                  Página {pageIndex + 1} de {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageIndex + 1);
                  }}
                  className={
                    pageIndex + 1 >= totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
}
