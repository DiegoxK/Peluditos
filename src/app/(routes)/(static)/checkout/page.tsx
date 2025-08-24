"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import CheckoutForm from "./_components/checkout-form";
import OrderSummary from "./_components/order-summary";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/hooks/store/cart-store";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/products");
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-primary">
        <div className="space-y-2 px-4 py-12 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight">
            Finalizar Compra
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Completa tus datos para procesar tu pedido de forma segura.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-8">
        <Separator className="mb-8" />

        <div className="grid grid-cols-1 gap-x-12 gap-y-8 rounded-lg border bg-white/80 p-8 shadow-md lg:grid-cols-2">
          <div className="lg:col-span-1">
            <CheckoutForm />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </>
  );
}
