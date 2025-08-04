"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import Sidebar from "./sidebar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PetsView() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const [data] = api.pets.getPublicPets.useSuspenseQuery({
    pageIndex,
    pageSize,
  });

  const pets = data.items; // assuming API returns { items, total }
  const totalPets = data.total;
  const totalPages = Math.ceil(totalPets / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageIndex(newPage);
    }
  };

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

        {/* Pagination Component */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pageIndex - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i === pageIndex}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 5 && <PaginationEllipsis />}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pageIndex + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
    </>
  );
}
