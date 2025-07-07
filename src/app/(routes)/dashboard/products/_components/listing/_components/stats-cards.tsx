"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Cat, Dog, Squirrel } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";

import { Skeleton } from "@/components/ui/skeleton";

export function StatsCards() {
  const [summaryStats] = api.products.getDashboardSummary.useSuspenseQuery();

  // TODO: update icons

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardTitle className="text-primary flex items-center gap-2">
          <Cat strokeWidth={2.2} />
          <span className="font-semibold">Total de Productos</span>
        </CardTitle>
        <div className="mx-4">
          <Separator className="bg-input" />
        </div>
        <CardContent className="px-4">
          <div className="text-primary text-2xl font-bold">
            {summaryStats.total}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardTitle className="text-primary flex items-center gap-2">
          <Squirrel strokeWidth={2.2} />
          <span className="font-semibold">Productos disponibles</span>
        </CardTitle>
        <div className="mx-4">
          <Separator className="bg-input" />
        </div>
        <CardContent className="px-4">
          <div className="text-primary text-2xl font-bold">
            {summaryStats.available}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardTitle className="text-primary flex items-center gap-2">
          <Dog strokeWidth={2.2} />
          <span className="font-semibold">Agotados</span>
        </CardTitle>
        <div className="mx-4">
          <Separator className="bg-input" />
        </div>
        <CardContent className="px-4">
          <div className="text-primary text-2xl font-bold">
            {summaryStats.outOfStock}
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
          <Cat strokeWidth={2.2} />
          <span className="font-semibold">Total de Productos</span>
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
          <Squirrel strokeWidth={2.2} />
          <span className="font-semibold">Productos disponibles</span>
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
          <Dog strokeWidth={2.2} />
          <span className="font-semibold">Agotados</span>
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
