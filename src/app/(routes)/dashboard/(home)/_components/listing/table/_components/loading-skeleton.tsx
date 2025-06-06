import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, ListRestart, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTableSkeleton() {
  return (
    <div className="bg-sidebar border-sidebar-border space-y-4 border p-4">
      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-primary text-2xl font-semibold">
              Listado de Mascotas
            </h2>
            <span className="text-muted-foreground">
              <Skeleton className="h-[24px] w-full" />
            </span>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Mascota
          </Button>
        </div>

        <div className="flex w-full items-center gap-2">
          <Input
            disabled
            placeholder="Buscar por nombre, raza o especie..."
            className="bg-background w-full rounded-md border px-4 py-2 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-8 w-25" />
            <Skeleton className="h-8 w-25" />
            <Skeleton className="h-8 w-25" />
          </div>

          <div className="flex items-center gap-2">
            <Button disabled variant="outline" size="sm">
              <ListRestart className="mr-2 h-4 w-4" />
              Limpiar Filtros
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Exportar exel
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="bg-background">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-6 w-full" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 7 }).map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
