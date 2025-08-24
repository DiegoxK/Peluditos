"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/hooks/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/server/db/schema";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductPurchasePanelProps {
  product: Product;
}

export default function ProductPurchasePanel({
  product,
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const addItemToCart = useCartStore((state) => state.addItem);

  const isSale = product.previousPrice && product.previousPrice > product.price;

  const handleAddToCart = () => {
    addItemToCart(product, quantity);

    toast.success(`"${product.name}" añadido al carrito!`, {
      description: `Total de artículos en el carrito: ${useCartStore.getState().getTotalItems()}`,
      position: "bottom-left",
    });
  };

  const incrementQuantity = () => {
    setQuantity((prev) => (prev < product.stock ? prev + 1 : prev));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <p className="text-primary/80 text-sm font-medium">
          {product.category.name} / {product.subcategory.name}
        </p>
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {product.name}
        </h1>
      </div>
      <div className="flex items-baseline gap-3">
        <p className="text-primary text-3xl font-bold">
          {formatPrice(product.price)}
        </p>
        {isSale && (
          <p className="text-muted-foreground text-xl line-through">
            {formatPrice(product.previousPrice)}
          </p>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Cantidad:</Label>
          <div className="flex items-center gap-2 rounded-lg border p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="mr-2 size-5" />
          {product.stock > 0 ? "Añadir al Carrito" : "Agotado"}
        </Button>
      </div>

      <div>
        {product.stock > 0 ? (
          <Badge variant="secondary">
            {product.stock} unidades disponibles
          </Badge>
        ) : (
          <Badge variant="destructive">Producto no disponible</Badge>
        )}
      </div>
    </div>
  );
}
