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
import {
  DEFAULT_FILTERS,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  type Filters,
} from "@/config/pet-defaults";

export default function PetsView() {
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const pageSize = DEFAULT_PAGE_SIZE;

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

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
              <PaginationItem>
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
