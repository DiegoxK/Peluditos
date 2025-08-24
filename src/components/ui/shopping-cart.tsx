"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/hooks/store/cart-store";

export function Cart() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Button variant="ghost" size="icon" className="group relative">
      <ShoppingCart className="text-primary group-hover:text-primary-foreground size-6" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full p-2"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );
}
