"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useTransition,
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

import { useDebouncedValueWithTransition } from "@/hooks/use-debounce-value";

import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTING,
  defaultInitialTableQueryInput,
} from "@/config/filter-defaults";

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
  isUpdatingTable: boolean;
  isFilterProcessing: boolean;
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
  const [isPendingTransition, startTransition] = useTransition();

  // Initialize states based on defaults
  const [sorting, _setSorting] = useState<SortingState>(
    defaultInitialTableQueryInput.sorting ?? [],
  );
  const [columnFilters, _setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>(
    defaultInitialTableQueryInput.globalFilter ?? "",
  );
  const [pagination, _setPagination] = useState<PaginationState>({
    pageIndex: defaultInitialTableQueryInput.pageIndex,
    pageSize: defaultInitialTableQueryInput.pageSize,
  });

  // --- Transition-Wrapped Setters ---
  const setSorting = useCallback(
    (updater: SetStateAction<SortingState>) => {
      startTransition(() => {
        _setSorting(updater);
      });
    },
    [_setSorting],
  );

  const setColumnFilters = useCallback(
    (updater: SetStateAction<ColumnFiltersState>) => {
      startTransition(() => {
        _setColumnFilters(updater);
      });
    },
    [_setColumnFilters],
  );

  const setPagination = useCallback(
    (updater: SetStateAction<PaginationState>) => {
      startTransition(() => {
        _setPagination(updater);
      });
    },
    [_setPagination],
  );

  const [debouncedGlobalFilter, isGlobalFilterTransitionPending] =
    useDebouncedValueWithTransition(globalFilter, 500);

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

  const isTyping = globalFilter !== debouncedGlobalFilter;
  const isFilterProcessing = isTyping || isGlobalFilterTransitionPending;

  // --- Action Callbacks ---
  const resetToFirstPage = useCallback(() => {
    startTransition(() => {
      _setPagination((prev) => ({ ...prev, pageIndex: DEFAULT_PAGE_INDEX }));
    });
  }, [_setPagination]);

  const resetFiltersAndSorting = useCallback(() => {
    startTransition(() => {
      setGlobalFilter("");
      _setColumnFilters([]);
      _setSorting(DEFAULT_SORTING);
    });
  }, [setGlobalFilter, _setColumnFilters, _setSorting]);

  const resetTableToDefaults = useCallback(() => {
    startTransition(() => {
      setGlobalFilter("");
      _setColumnFilters([]);
      _setSorting(DEFAULT_SORTING);
      _setPagination({
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
      });
    });
  }, [setGlobalFilter, _setColumnFilters, _setSorting, _setPagination]);

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
    isUpdatingTable: isPendingTransition,
    isFilterProcessing,
  };

  return (
    <TableStateContext.Provider value={value}>
      {children}
    </TableStateContext.Provider>
  );
};
