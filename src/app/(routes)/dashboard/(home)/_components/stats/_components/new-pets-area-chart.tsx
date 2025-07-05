"use client";

import { ChartColumn, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

export const description = "A simple area chart";

const chartData = [
  { month: "Enero", pets: 0 },
  { month: "Febrero", pets: 0 },
  { month: "Marzo", pets: 237 },
  { month: "Abril", pets: 73 },
  { month: "Mayo", pets: 0 },
  { month: "Junio", pets: 214 },
  { month: "Julio", pets: 300 },
  { month: "Agosto", pets: 250 },
  { month: "Septiembre", pets: 400 },
  { month: "Octubre", pets: 350 },
  { month: "Noviembre", pets: 450 },
  { month: "Diciembre", pets: 500 },
];

const chartConfig = {
  pets: {
    label: "Mascotas",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function NewPetsAreaChart() {
  return (
    <Card>
      <CardTitle className="text-primary flex items-center gap-2">
        <ChartColumn strokeWidth={2.2} />
        <span className="font-semibold">Nuevas mascotas</span>
      </CardTitle>
      <div className="mx-4">
        <Separator className="bg-border" />
      </div>
      <CardContent>
        <ChartContainer className="max-h-68 w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="pets"
              type="natural"
              fill="var(--color-pets)"
              fillOpacity={0.4}
              stroke="var(--color-pets)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <div className="mx-4">
        <Separator className="bg-border" />
      </div>
      <CardFooter className="flex-col gap-2 text-sm">
        <CardDescription>Nuevas mascotas por mes</CardDescription>
      </CardFooter>
    </Card>
  );
}
