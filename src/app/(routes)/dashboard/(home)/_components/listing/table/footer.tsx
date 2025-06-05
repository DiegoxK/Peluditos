import { Button } from "@/components/ui/button";
import type { Pet } from "@/server/db/schema";
import type { Table } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableFooterProps {
  totalRowCount: number;
  table: Table<Pet>;
}

export default function DataTableFooter({
  totalRowCount,
  table,
}: DataTableFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-4">
      <div className="flex items-center space-x-2">
        <span className="text-muted-foreground text-sm">
          Página{" "}
          {totalRowCount > 0 ? table.getState().pagination.pageIndex + 1 : 0} de{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
      </div>
      <div>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tamaño" />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                Mostrar {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
