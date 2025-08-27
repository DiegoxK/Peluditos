"use client";

import { api } from "@/trpc/react";
import { StatusPie } from "./_components/status-pie";
import { ShippedRadial } from "./_components/shipped-radial";
import { CancelationRate } from "./_components/cancelation-rate";
import { RevenueOverTime } from "./_components/revenue-over-time";

export default function TransactionStats() {
  const [transactionStats] = api.orders.getStats.useSuspenseQuery();

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
