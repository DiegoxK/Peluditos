"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import type { Filters } from "./pets-view";

const ageRanges = [
  { id: "cachorro", label: "Cachorro (0-1 año)" },
  { id: "joven", label: "Joven (2-4 años)" },
  { id: "adulto", label: "Adulto (5-8 años)" },
  { id: "senior", label: "Senior (9+ años)" },
] as const;

const sizes = [
  { id: "pequeno", label: "Pequeño (0-10 kg)" },
  { id: "mediano", label: "Mediano (11-25 kg)" },
  { id: "grande", label: "Grande (26+ kg)" },
] as const;

interface SidebarProps {
  onApplyFilters: (filters: Filters) => void;
}

export default function Sidebar({ onApplyFilters }: SidebarProps) {
  const [localFilters, setLocalFilters] = useState<Filters>({});

  const handleCheckboxChange = (
    category: "ageRanges" | "sizes",
    id: string,
    checked: boolean,
  ) => {
    setLocalFilters((prev) => {
      const currentValues = prev[category] ?? [];
      const newValues = checked
        ? [...currentValues, id]
        : currentValues.filter((val) => val !== id);
      return { ...prev, [category]: newValues };
    });
  };

  const handleRadioChange = (category: "species" | "gender", value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [category]: value === "all" ? undefined : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      sortBy: value as Filters["sortBy"],
    }));
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onApplyFilters({});
  };

  return (
    <aside className="relative h-fit w-full shrink-0 space-y-6 rounded-md border bg-white/70 shadow-sm md:w-80">
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Filtros</h2>
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            Limpiar
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base">Especie</Label>
            <RadioGroup
              value={localFilters.species ?? "all"}
              onValueChange={(val) => handleRadioChange("species", val)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="specie-all" />
                <Label htmlFor="specie-all">Todas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perro" id="specie-dog" />
                <Label htmlFor="specie-dog">Perro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gato" id="specie-cat" />
                <Label htmlFor="specie-cat">Gato</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base">Sexo</Label>
            <RadioGroup
              value={localFilters.gender ?? "all"}
              onValueChange={(val) => handleRadioChange("gender", val)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="gender-all" />
                <Label htmlFor="gender-all">Cualquiera</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="macho" id="gender-male" />
                <Label htmlFor="gender-male">Macho</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hembra" id="gender-female" />
                <Label htmlFor="gender-female">Hembra</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base">Edad</Label>
            {ageRanges.map((age) => (
              <div key={age.id} className="flex items-center space-x-2">
                <Checkbox
                  id={age.id}
                  checked={!!localFilters.ageRanges?.includes(age.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("ageRanges", age.id, !!checked)
                  }
                />
                <Label htmlFor={age.id} className="font-normal">
                  {age.label}
                </Label>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base">Tamaño</Label>
            {sizes.map((size) => (
              <div key={size.id} className="flex items-center space-x-2">
                <Checkbox
                  id={size.id}
                  checked={!!localFilters.sizes?.includes(size.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("sizes", size.id, !!checked)
                  }
                />
                <Label htmlFor={size.id} className="font-normal">
                  {size.label}
                </Label>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="sort-by" className="text-base">
              Ordenar por
            </Label>
            <Select
              value={localFilters.sortBy ?? "newest"}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="sort-by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más Recientes</SelectItem>
                <SelectItem value="ageAsc">Edad (Menor a Mayor)</SelectItem>
                <SelectItem value="ageDesc">Edad (Mayor a Menor)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="sticky bottom-6 z-10 border-y bg-white/50 p-6 backdrop-blur-sm">
        <Button onClick={() => onApplyFilters(localFilters)} className="w-full">
          Aplicar Filtros
        </Button>
      </div>
    </aside>
  );
}
