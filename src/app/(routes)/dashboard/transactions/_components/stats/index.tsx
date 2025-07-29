"use client";

import { api } from "@/trpc/react";
import { StatusPie } from "./_components/status-pie";
import { ShippedRadial } from "./_components/shipped-radial";
import { CancelationRate } from "./_components/cancelation-rate";

export default function TransactionStats() {
  const transactionStats = {
    totalOrders: 110,
    statuses: [
      { label: "enviado", amount: 20 },
      { label: "procesando", amount: 5 },
      { label: "entregado", amount: 100 },
      { label: "cancelado", amount: 2 },
    ],
    shipped: {
      total: 100,
      delivered: 80,
    },
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <StatusPie
          statuses={transactionStats.statuses}
          total={transactionStats.totalOrders}
        />
        <ShippedRadial
          total={transactionStats.shipped.total}
          delivered={transactionStats.shipped.delivered}
        />
        <CancelationRate
          total={transactionStats.totalOrders}
          canceled={
            transactionStats.statuses.find(
              (status) => status.label === "cancelado",
            )?.amount ?? 0
          }
        />
      </div>
    </>
  );
}
