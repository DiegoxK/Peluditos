"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { ProductFilters } from "./products-view";
import { api } from "@/trpc/react";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  onApplyFilters: (filters: ProductFilters) => void;
}

export default function Sidebar({ onApplyFilters }: SidebarProps) {
  const [categoriesData] = api.categories.getAll.useSuspenseQuery();
  const [localFilters, setLocalFilters] = useState<ProductFilters>({
    sortBy: "newest",
  });

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const currentCategories = prev.categories ?? [];
      const newCategories = checked
        ? [...currentCategories, categoryId]
        : currentCategories.filter((id) => id !== categoryId);
      return { ...prev, categories: newCategories };
    });
  };

  const handleSortChange = (value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      sortBy: value as ProductFilters["sortBy"],
    }));
  };

  const handleClearFilters = () => {
    const defaultFilters = { sortBy: "newest" as const };
    setLocalFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };

  const handleSubmit = () => {
    onApplyFilters(localFilters);
  };

  return (
    <aside className="h-fit w-full shrink-0 space-y-4 rounded-lg border bg-white/70 p-6 shadow-sm md:w-80">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filtros</h2>
        <Button variant="outline" size="sm" onClick={handleClearFilters}>
          Limpiar
        </Button>
      </div>

      <Separator />
      <Label className="text-base">Categorías</Label>
      <div className="grid gap-3">
        {categoriesData?.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={category.id}
              checked={!!localFilters.categories?.includes(category.id)}
              onCheckedChange={(checked) =>
                handleCategoryChange(category.id, !!checked)
              }
            />
            <Label htmlFor={category.id} className="font-normal">
              {category.label}
            </Label>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Label className="text-base">Ordenar por</Label>
        <Select value={localFilters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más Recientes</SelectItem>
            <SelectItem value="priceAsc">Precio (Menor a Mayor)</SelectItem>
            <SelectItem value="priceDesc">Precio (Mayor a Menor)</SelectItem>
            <SelectItem value="sales">Más Vendidos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="border-t pt-4">
        <Button onClick={handleSubmit} className="w-full">
          Aplicar Filtros
        </Button>
      </div>
    </aside>
  );
}
