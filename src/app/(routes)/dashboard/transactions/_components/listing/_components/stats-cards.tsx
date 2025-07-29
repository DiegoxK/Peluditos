"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Box, DollarSign, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";

import { Skeleton } from "@/components/ui/skeleton";

export function StatsCards() {
  const [summaryStats] = api.orders.getDashboardSummary.useSuspenseQuery();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardTitle className="text-primary flex items-center gap-2">
          <Box strokeWidth={2.2} />
          <span className="font-semibold">Total de Pedidos</span>
        </CardTitle>
        <div className="mx-4">
          <Separator className="bg-input" />
        </div>
        <CardContent className="px-4">
          <div className="text-primary text-2xl font-bold">
            {summaryStats.totalOrders}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardTitle className="text-primary flex items-center gap-2">
          <Truck strokeWidth={2.2} />
          <span className="font-semibold">Pedidos Enviados</span>
        </CardTitle>
        <div className="mx-4">
          <Separator className="bg-input" />
        </div>
        <CardContent className="px-4">
          <div className="text-primary text-2xl font-bold">
            {summaryStats.shipped}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardTitle className="text-primary flex items-center gap-2">
          <DollarSign strokeWidth={2.2} />
          <span className="font-semibold">Total Ventas</span>
        </CardTitle>
        <div className="mx-4">
          <Separator className="bg-input" />
        </div>
        <CardContent className="px-4">
          <div className="text-primary text-2xl font-bold">
            {summaryStats.totalRevenue}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardTitle className="text-primary flex items-center gap-2">
          <Box strokeWidth={2.2} />
          <span className="font-semibold">Total de Pedidos</span>
        </CardTitle>
        <div className="mx-4">
          <Separator className="bg-input" />
        </div>
        <CardContent className="px-4">
          <Skeleton className="size-8" />
        </CardContent>
      </Card>

      <Card>
        <CardTitle className="text-primary flex items-center gap-2">
          <Truck strokeWidth={2.2} />
          <span className="font-semibold">Pedidos Enviados</span>
        </CardTitle>
        <div className="mx-4">
          <Separator className="bg-input" />
        </div>
        <CardContent className="px-4">
          <Skeleton className="size-8" />
        </CardContent>
      </Card>

      <Card>
        <CardTitle className="text-primary flex items-center gap-2">
          <DollarSign strokeWidth={2.2} />
          <span className="font-semibold">Total Ventas</span>
        </CardTitle>
        <div className="mx-4">
          <Separator className="bg-input" />
        </div>
        <CardContent className="px-4">
          <Skeleton className="size-8" />
        </CardContent>
      </Card>
    </div>
  );
}
