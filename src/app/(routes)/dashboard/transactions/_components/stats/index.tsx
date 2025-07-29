"use client";

import { api } from "@/trpc/react";
import { StatusPie } from "./_components/status-pie";

export default function TransactionStats() {
  const transactionStats = {
    totalOrders: 110,
    statuses: [
      { label: "enviado", amount: 20 },
      { label: "procesando", amount: 5 },
      { label: "entregado", amount: 100 },
      { label: "cancelado", amount: 2 },
    ],
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <StatusPie
          statuses={transactionStats.statuses}
          total={transactionStats.totalOrders}
        />
      </div>
    </>
  );
}
