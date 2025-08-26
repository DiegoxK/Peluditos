"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Code2,
  Home,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import type { EpaycoTransactionValidationData } from "epayco-checkout-community-sdk/server";

export type ValidationState = {
  status: "success" | "pending" | "rejected" | "error";
  message: string;
  data: EpaycoTransactionValidationData | null;
  error?: string;
};

interface TransactionStatusCardProps {
  state: ValidationState;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-green-600",
    title: "¡Pago Aprobado!",
  },
  pending: {
    icon: Clock,
    color: "text-amber-600",
    title: "Tu Pago está en Proceso",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-600",
    title: "Pago Rechazado",
  },
  error: {
    icon: AlertTriangle,
    color: "text-red-600",
    title: "Ocurrió un Error",
  },
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default function TransactionStatusCard({
  state,
}: TransactionStatusCardProps) {
  const config = statusConfig[state.status];
  const Icon = config.icon;

  return (
    <Card className="mx-auto w-full max-w-lg shadow-lg">
      <CardHeader className="w-full items-center justify-center text-center">
        <Icon className={`size-16 justify-self-center ${config.color}`} />
        <CardTitle className="text-2xl">{config.title}</CardTitle>
        <CardDescription className="max-w-sm">{state.message}</CardDescription>
      </CardHeader>
      <CardContent>
        {state.data && (
          <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">Detalles de la Transacción</h3>
            <Separator />
            <div className="space-y-2">
              <DetailRow
                label="Referencia ePayco"
                value={state.data.x_ref_payco}
              />
              <DetailRow label="Factura" value={state.data.x_id_invoice} />
              <DetailRow
                label="Monto Pagado"
                value={formatPrice(state.data.x_amount)}
              />
              <DetailRow
                label="Método"
                value={`${state.data.x_franchise} **** ${state.data.x_cardnumber.slice(-4)}`}
              />
              <DetailRow label="Fecha" value={state.data.x_transaction_date} />
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-center text-sm text-amber-800">
          <p>
            <strong>Nota:</strong> Este es un proyecto de demostración. No se ha
            vendido ni se enviará ningún producto real.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4">
        {state.status === "success" && (
          <Button asChild className="w-full">
            <Link href="/products">
              <Home className="mr-2 size-4" /> Seguir Comprando
            </Link>
          </Button>
        )}
        {state.status === "rejected" && (
          <Button asChild className="w-full">
            <Link href="/checkout">
              <RefreshCw className="mr-2 size-4" /> Intentar de Nuevo
            </Link>
          </Button>
        )}
        <Button asChild variant="ghost" className="w-full">
          <Link href="/about">
            <Code2 className="mr-2 size-4" /> Ver Detalles del Proyecto
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
