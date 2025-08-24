"use client";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/hooks/store/cart-store";

export default function CartView({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <ShoppingCart className="text-muted-foreground size-16" />
        <h3 className="text-xl font-semibold">Tu carrito está vacío</h3>
        <p className="text-muted-foreground text-sm">
          Los productos que añadas aparecerán aquí.
        </p>
        <Button asChild>
          <Link href="/products">Ir a la Tienda</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pr-4">
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item._id} className="flex items-start gap-4 py-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={item.image || "/placeholder.svg"} // Fallback image
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-muted-foreground text-sm">
                  {formatPrice(item.price)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-5 text-center text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={() => removeItem(item._id)}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto border-t pt-4">
        <Separator className="my-4" />
        <div className="flex justify-between font-semibold">
          <p>Subtotal</p>
          <p>{formatPrice(getTotalPrice())}</p>
        </div>
        <Link href="/checkout">
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            size="lg"
            className="mt-6 w-full"
          >
            Proceder al Pago
          </Button>
        </Link>
      </div>
    </div>
  );
}
