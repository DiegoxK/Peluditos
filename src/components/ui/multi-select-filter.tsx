"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Column } from "@tanstack/react-table";
import { Filter, XCircle } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  disabled?: boolean;
  title: string;
  options: readonly (string | Option)[];
}

export function MultiSelectFilter<TData, TValue>({
  column,
  disabled,
  title,
  options,
}: MultiSelectFilterProps<TData, TValue>) {
  const activeFilterValues =
    (column.getFilterValue() as string[] | undefined) ?? [];

  const [selectedValues, setSelectedValues] =
    useState<string[]>(activeFilterValues);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedValues(
        (column.getFilterValue() as string[] | undefined) ?? [],
      );
    }
  }, [isOpen, column]);

  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    setSelectedValues((prev) => {
      if (isChecked) {
        return [...new Set([...prev, value])];
      } else {
        return prev.filter((v) => v !== value);
      }
    });
  };

  const handleApplyFilters = () => {
    column.setFilterValue(
      selectedValues.length > 0 ? selectedValues : undefined,
    );
    setIsOpen(false);
  };

  const handleClearLocal = () => {
    setSelectedValues([]);
  };

  const handleClearAndApply = () => {
    setSelectedValues([]);
    column.setFilterValue(undefined);
    setIsOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedValues(activeFilterValues);
    } else {
      setSelectedValues(activeFilterValues);
    }
  };

  const currentAppliedCount = activeFilterValues.length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size="sm"
          className="relative h-9"
        >
          <Filter className="mr-2 h-4 w-4" />
          {title}
          {currentAppliedCount > 0 && (
            <span className="bg-primary text-primary-foreground ml-2 flex h-5 w-5 items-center justify-center rounded-full text-xs">
              {currentAppliedCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[220px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Filtrar por {title}</span>
          {selectedValues.length > 0 && (
            <Button
              className="hover:text-destructive size-5 hover:bg-transparent"
              variant="ghost"
              size="icon"
              onClick={handleClearLocal}
            >
              <XCircle />
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[200px] overflow-y-auto pr-1">
          {options.map((option) => {
            const isObject = typeof option === "object";
            const value = isObject ? option.value : option;
            const label = isObject ? option.label : option;

            const isSelected = selectedValues.includes(value);

            return (
              <DropdownMenuCheckboxItem
                key={value}
                checked={isSelected}
                className="capitalize"
                onCheckedChange={(checked) => {
                  handleCheckboxChange(value, !!checked);
                }}
                onSelect={(e) => e.preventDefault()}
              >
                {label}
              </DropdownMenuCheckboxItem>
            );
          })}
        </div>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-end gap-2 p-2">
          {currentAppliedCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAndApply}
              className="h-8 text-xs hover:bg-red-500"
            >
              Remover Filtros
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleApplyFilters}
            className="h-8 text-xs"
          >
            Aplicar
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
