"use client";

import { api } from "@/trpc/react";
import { StatusPie } from "./_components/status-pie";
import { ShippedRadial } from "./_components/shipped-radial";
import { CancelationRate } from "./_components/cancelation-rate";
import { RevenueOverTime } from "./_components/revenue-over-time";

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
    revenue: {
      "2025": [
        { month: "January", revenue: 50000 },
        { month: "February", revenue: 888489 },
        { month: "March", revenue: 0 },
        { month: "April", revenue: 1050 },
        { month: "May", revenue: 2156 },
        { month: "June", revenue: 486489 },
        { month: "July", revenue: 0 },
        { month: "August", revenue: 0 },
        { month: "September", revenue: 0 },
        { month: "October", revenue: 0 },
        { month: "November", revenue: 0 },
        { month: "December", revenue: 0 },
      ],
      "2024": [
        { month: "January", revenue: 50000 },
        { month: "February", revenue: 888489 },
        { month: "March", revenue: 0 },
        { month: "April", revenue: 1050 },
        { month: "May", revenue: 2156 },
        { month: "June", revenue: 486489 },
        { month: "July", revenue: 486489 },
        { month: "August", revenue: 486489 },
        { month: "September", revenue: 486489 },
        { month: "October", revenue: 486489 },
        { month: "November", revenue: 486489 },
        { month: "December", revenue: 486548 },
      ],
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
      <RevenueOverTime registry={transactionStats.revenue} />
    </>
  );
}
