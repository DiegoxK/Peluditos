"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import type {
  SortingState,
  ColumnFiltersState,
  PaginationState,
  ColumnFilter as TanStackColumnFilter,
} from "@tanstack/react-table";
import { useDebouncedValue } from "@/hooks/use-debounce-value";
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTING,
  defaultInitialTableQueryInput,
} from "@/config/pet-defaults";

// --- Type Definitions ---
type ServerColumnFilterValue =
  | string
  | string[]
  | number
  | boolean
  | null
  | undefined;

export interface ServerQueryColumnFilter {
  id: string;
  value: ServerColumnFilterValue;
}

export interface TableQueryInput {
  pageIndex: number;
  pageSize: number;
  sorting?: SortingState;
  globalFilter?: string;
  columnFilters?: ServerQueryColumnFilter[];
}

interface TableStateContextType {
  // Raw TanStack Table states
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;

  // Derived query input, ready to be sent to tRPC
  currentQueryInput: TableQueryInput;

  // Common actions
  resetToFirstPage: () => void;
  resetFiltersAndSorting: () => void; // Resets filters and sorting, keeps pagination
  resetTableToDefaults: () => void; // Resets everything including pagination to initial
}

// --- Context Creation ---
const TableStateContext = createContext<TableStateContextType | undefined>(
  undefined,
);

// --- Custom Hook for Consuming Context ---
export const useTableState = () => {
  const context = useContext(TableStateContext);
  if (!context) {
    throw new Error("useTableState must be used within a TableStateProvider");
  }
  return context;
};

// --- Provider Component ---
interface TableStateProviderProps {
  children: ReactNode;
}

export const TableStateProvider = ({ children }: TableStateProviderProps) => {
  // Initialize states based on defaults
  const [sorting, setSorting] = useState<SortingState>(
    defaultInitialTableQueryInput.sorting ?? [],
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>(
    defaultInitialTableQueryInput.globalFilter ?? "",
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: defaultInitialTableQueryInput.pageIndex,
    pageSize: defaultInitialTableQueryInput.pageSize,
  });

  const debouncedGlobalFilter = useDebouncedValue(globalFilter, 500);

  // Memoized derivation of the query input object for tRPC
  const currentQueryInput = useMemo((): TableQueryInput => {
    const mappedColumnFilters: ServerQueryColumnFilter[] = columnFilters
      .map((cf: TanStackColumnFilter) => ({
        id: cf.id,
        value: cf.value as ServerColumnFilterValue,
      }))
      // Filter out filters that are effectively "empty"
      .filter(
        (f) =>
          f.value !== undefined &&
          f.value !== null &&
          (typeof f.value === "string" ? f.value.trim() !== "" : true) &&
          (Array.isArray(f.value) ? f.value.length > 0 : true),
      );

    return {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting: sorting.length > 0 ? sorting : undefined,
      globalFilter:
        debouncedGlobalFilter.trim() === "" ? undefined : debouncedGlobalFilter,
      columnFilters:
        mappedColumnFilters.length > 0 ? mappedColumnFilters : undefined,
    };
  }, [pagination, sorting, debouncedGlobalFilter, columnFilters]);

  // --- Action Callbacks ---
  const resetToFirstPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: DEFAULT_PAGE_INDEX }));
  }, []);

  const resetFiltersAndSorting = useCallback(() => {
    setGlobalFilter("");
    setColumnFilters([]);
    setSorting(DEFAULT_SORTING);
  }, []);

  const resetTableToDefaults = useCallback(() => {
    resetFiltersAndSorting();
    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  }, [resetFiltersAndSorting]);

  // --- Context Value ---
  const value: TableStateContextType = {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    currentQueryInput,
    resetToFirstPage,
    resetFiltersAndSorting,
    resetTableToDefaults,
  };

  return (
    <TableStateContext.Provider value={value}>
      {children}
    </TableStateContext.Provider>
  );
};
