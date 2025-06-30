"use client";

import { Cat, TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

const chartData = [
  { specie: "perro", amount: 5, fill: "var(--chart-1)" },
  { specie: "gato", amount: 15, fill: "var(--chart-2)" },
];

const chartConfig = {
  perro: {
    label: "Perro",
  },
  gato: {
    label: "Gato",
  },
} satisfies ChartConfig;

export function SpeciesPie() {
  return (
    <Card>
      <CardTitle className="text-primary flex items-center gap-2">
        <Cat strokeWidth={2.2} />
        <span className="font-semibold">Especies</span>
      </CardTitle>

      <div className="mx-4">
        <Separator className="bg-input" />
      </div>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-square size-64 max-h-64"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="amount" nameKey="specie" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <CardDescription>January - June 2024</CardDescription>
      </CardFooter>
    </Card>
  );
}
