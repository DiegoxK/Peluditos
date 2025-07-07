"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/server/db/schema";
import { MoreHorizontal } from "lucide-react";
import ProductDetails from "./_components/product-details";
import DeleteProductAction from "./_components/delete-product-action";
import CreateProductForm from "./_components/create-product-form";

interface ProductDataTableActionsProps {
  product: Product;
}

export default function ProductDataTableActions({
  product,
}: ProductDataTableActionsProps) {
  const { openDialog } = useDialog();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            openDialog({
              title: `Detalles de ${product.name}`,
              description: "Información completa del producto.",
              content: () => <ProductDetails product={product} />,
            })
          }
        >
          Ver detalles
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            openDialog({
              title: `Editar ${product.name}`,
              description:
                "Modifique los detalles del producto y guarde los cambios.",
              content: () => <CreateProductForm product={product} />,
            })
          }
        >
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            openDialog({
              title: `¿Eliminar ${product.name}?`,
              description:
                "Esta acción no se puede deshacer. El producto será eliminado permanentemente.",
              content: () => <DeleteProductAction product={product} />,
            })
          }
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
