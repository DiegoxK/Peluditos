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
import { ProductCard } from "./product-card";

export type ProductFilters = {
  categories?: string[];
  subcategories?: string[];
  sortBy?: "newest" | "priceAsc" | "priceDesc" | "sales";
};

export default function ProductsView() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 8;

  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: "newest",
  });

  const [data] = api.products.getPublicProducts.useSuspenseQuery({
    pageIndex,
    pageSize,
    ...filters,
  });

  const products = data.items;
  const totalProducts = data.total;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageIndex(newPage);
    }
  };

  const handleApplyFilters = (newFilters: ProductFilters) => {
    setPageIndex(0);
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col gap-8 py-6 md:flex-row md:gap-4">
      <Sidebar onApplyFilters={handleApplyFilters} />
      <main className="w-full space-y-8 rounded-md border bg-white/70 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="text-muted-foreground col-span-full py-24 text-center">
              <h3 className="text-xl font-semibold">
                No se encontraron productos
              </h3>
              <p>Intenta ajustar tus filtros o revisa más tarde.</p>
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
                    pageIndex === 0 ? "pointer-events-none opacity-50" : ""
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
                      : ""
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
