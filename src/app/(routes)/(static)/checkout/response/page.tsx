"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { EpaycoValidationApiResponse } from "epayco-checkout-community-sdk/server";
import TransactionStatusCard, {
  type ValidationState,
} from "../_components/transaction-status-card";
import TransactionStatusSkeleton from "../_components/transaction-status-skeleton";
import { useCartStore } from "@/hooks/store/cart-store";

function CheckoutResponse() {
  const searchParams = useSearchParams();
  const ref_payco = searchParams.get("ref_payco");
  const clearCart = useCartStore((state) => state.clearCart);

  const [validationState, setValidationState] = useState<ValidationState>({
    status: "pending",
    message: "Verificando estado del pago...",
    data: null,
  });

  useEffect(() => {
    if (ref_payco) {
      const validateTransaction = async () => {
        try {
          const response = await fetch(
            `https://secure.epayco.co/validation/v1/reference/${ref_payco}`,
          );
          if (!response.ok)
            throw new Error(
              `Error ${response.status} validando la transacción.`,
            );

          const result = (await response.json()) as EpaycoValidationApiResponse;

          if (result.success && result.data) {
            switch (result.data.x_cod_respuesta) {
              case 1:
                setValidationState({
                  status: "success",
                  message:
                    "Hemos recibido tu pago y tu pedido demostrativo está en preparación.",
                  data: result.data,
                });
                clearCart();
                break;
              case 3:
                setValidationState({
                  status: "pending",
                  message:
                    "Tu pago está siendo verificado. Te notificaremos cuando se complete.",
                  data: result.data,
                });
                clearCart();
                break;
              default:
                setValidationState({
                  status: "rejected",
                  message: `Razón: ${result.data.x_response_reason_text}. Por favor, intente de nuevo.`,
                  data: result.data,
                });
                break;
            }
          } else {
            throw new Error(
              result.text_response || "Falló la validación de la transacción.",
            );
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error desconocido.";
          setValidationState({
            status: "error",
            message:
              "No pudimos verificar el estado de tu pago. Contacta a soporte si el problema persiste.",
            data: null,
            error: errorMessage,
          });
        }
      };
      void validateTransaction();
    } else {
      setValidationState({
        status: "error",
        message: "No se encontró una referencia de pago para validar.",
        data: null,
        error: "ref_payco no encontrado en la URL.",
      });
    }
  }, [ref_payco, clearCart]);

  return <TransactionStatusCard state={validationState} />;
}

export default function CheckoutResponsePage() {
  return (
    <>
      <div className="bg-primary">
        <div className="space-y-2 px-4 py-12 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight">
            Detalles de la Transacción
          </h1>
        </div>
      </div>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <Suspense fallback={<TransactionStatusSkeleton />}>
          <CheckoutResponse />
        </Suspense>
      </div>
    </>
  );
}
