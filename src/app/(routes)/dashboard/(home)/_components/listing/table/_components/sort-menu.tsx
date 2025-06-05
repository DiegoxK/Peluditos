"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { type Table, type SortingState } from "@tanstack/react-table";
import { ArrowUpDown, Check } from "lucide-react";

interface SortOption {
  label: string;
  value: SortingState;
}

interface SortGroup {
  label?: string;
  options: SortOption[];
}

interface SortMenuProps<TData> {
  table: Table<TData>;
  sortGroups: SortGroup[];
  title?: string;
}

export function SortMenu<TData>({
  table,
  sortGroups,
  title = "Ordenar",
}: SortMenuProps<TData>) {
  const currentSorting = table.getState().sorting;

  // Helper to check if a specific sort option is currently active
  const isSortActive = (optionValue: SortingState): boolean => {
    if (currentSorting.length !== optionValue.length) return false;
    if (optionValue.length === 0 && currentSorting.length === 0) return true;
    if (optionValue.length === 0) return false;

    return (
      currentSorting[0]?.id === optionValue[0]?.id &&
      currentSorting[0]?.desc === optionValue[0]?.desc
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="group" variant="outline" size="sm">
          <ArrowUpDown className="h-4 w-4" />
          {title}

          {currentSorting.length > 0 && (
            <span className="text-muted-foreground text-xs transition-all group-hover:text-white/50">
              ({currentSorting[0]?.id} {currentSorting[0]?.desc ? "Z-A" : "A-Z"}
              )
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="h-[300px] w-[230px]">
        <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sortGroups.map((group, groupIndex) => (
          <React.Fragment key={group.label ?? groupIndex}>
            {group.label && (
              <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
                {group.label}
              </DropdownMenuLabel>
            )}
            {group.options.map((option) => (
              <DropdownMenuItem
                key={option.label}
                onClick={() => table.setSorting(option.value)}
                className="flex items-center justify-between"
              >
                <span>{option.label}</span>
                {isSortActive(option.value) && (
                  <Check className="text-primary ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            {groupIndex < sortGroups.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
        {currentSorting.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => table.resetSorting()}
              className="text-destructive focus:bg-destructive transition-all focus:text-white"
            >
              Limpiar ordenamiento
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
