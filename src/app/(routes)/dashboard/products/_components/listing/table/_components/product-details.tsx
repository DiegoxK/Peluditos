"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useDialog } from "@/context/dialog-provider";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Product } from "@/server/db/schema";
import Image from "next/image";
import CreateProductForm from "./create-product-form";
import { Separator } from "@/components/ui/separator";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { openDialog } = useDialog();

  return (
    <div>
      <div className="grid max-h-[65vh] gap-6 overflow-y-scroll py-4 ps-1 pr-3">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="bg-accent relative flex size-32 w-fit items-center overflow-hidden rounded-md">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-2xl font-bold">{product.name}</h3>
            <p className="text-muted-foreground">
              {product.category.name} / {product.subcategory.name}
            </p>
            <Badge variant={product.featured ? "default" : "outline"}>
              {product.featured ? "Destacado" : "Normal"}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Details Grid */}
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Detalles de Venta</h4>
            <div className="grid grid-cols-2 gap-1 rounded-md border p-3">
              <span className="text-sm font-medium">Precio:</span>
              <span className="text-sm">{formatPrice(product.price)}</span>

              <span className="text-sm font-medium">Precio Anterior:</span>
              <span className="text-sm">
                {formatPrice(product.previousPrice)}
              </span>

              <span className="text-sm font-medium">Ventas:</span>
              <span className="text-sm">{product.sales}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Inventario</h4>
            <div className="grid grid-cols-2 gap-1 rounded-md border p-3">
              <span className="text-sm font-medium">Stock Actual:</span>
              <span className="text-sm">{product.stock} unidades</span>

              <span className="text-sm font-medium">Creado:</span>
              <span className="text-sm">{formatDate(product.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Descripción</h4>
          <div className="rounded-md border p-3">
            <p className="text-sm text-gray-800">
              {product.description || "No hay descripción disponible."}
            </p>
          </div>
        </div>

        {/* Features Section */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Características</h4>
            <div className="flex flex-wrap gap-2 rounded-md border p-3">
              {product.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="mt-4">
        <Button
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
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Cerrar</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}
