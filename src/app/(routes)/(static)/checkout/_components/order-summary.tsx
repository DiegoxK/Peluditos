"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/hooks/store/cart-store";

export default function OrderSummary() {
  const { items, getTotalPrice } = useCartStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de tu Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-start gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full text-xs font-bold">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
              </div>
              <p className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(getTotalPrice())}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
