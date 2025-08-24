"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import CartView from "./cart-view";
import { useCartStore } from "@/hooks/store/cart-store";
import { useState } from "react";
import { useHasHydrated } from "@/hooks/use-has-hydrated";

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const hasHydrated = useHasHydrated();
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary relative">
          <ShoppingCart className="size-6" />
          {hasHydrated && totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full p-2 text-xs"
            >
              {totalItems}
            </Badge>
          )}
          <span className="sr-only">Abrir carrito de compras</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Mi Carrito ({totalItems})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden px-6">
          <CartView setIsOpen={setIsOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
