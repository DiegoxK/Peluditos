"use client";

import { api } from "@/trpc/react";
import { StatusPie } from "./_components/status-pie";
import { ShippedRadial } from "./_components/shipped-radial";

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
      </div>
    </>
  );
}
