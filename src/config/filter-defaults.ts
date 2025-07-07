import type { SortingState } from "@tanstack/react-table";
import type { TableQueryInput } from "@/context/table-state-provider";

export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_SORTING: SortingState = [];

export const defaultInitialTableQueryInput: TableQueryInput = {
  pageIndex: DEFAULT_PAGE_INDEX,
  pageSize: DEFAULT_PAGE_SIZE,
  sorting: DEFAULT_SORTING.length > 0 ? DEFAULT_SORTING : undefined,
  globalFilter: undefined,
  columnFilters: undefined,
};
