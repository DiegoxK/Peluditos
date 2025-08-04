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
import { AspectRatio } from "@/components/ui/aspect-ratio";

import Image from "next/image";

export default function PetsView() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 9;

  const [data] = api.pets.getPublicPets.useSuspenseQuery({
    pageIndex,
    pageSize,
  });

  const pets = data.items;
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
      <main className="m-4 w-full space-y-4 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="hover:border-primary cursor-pointer rounded-md border bg-white/70 transition-all hover:-translate-y-1"
            >
              <AspectRatio ratio={1 / 1}>
                <Image fill src={pet.image} alt={`image of ${pet.name}`} />
              </AspectRatio>
              <div className="p-4">
                <h3 className="text-xl font-bold">{pet.name}</h3>
                <p title={pet.description} className="truncate overflow-hidden">
                  {pet.description}
                </p>
                <p className="text-sm text-gray-500">Edad: {pet.age} años</p>
              </div>
            </div>
          ))}
        </div>

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
