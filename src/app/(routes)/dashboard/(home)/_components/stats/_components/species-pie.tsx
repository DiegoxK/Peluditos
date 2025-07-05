"use client";

import { Cat } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
        <Separator className="bg-border" />
      </div>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square size-68 max-h-68"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              innerRadius={55}
              data={chartData}
              dataKey="amount"
              nameKey="specie"
              label
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 5}
                          className="fill-primary text-3xl font-bold"
                        >
                          20
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 12}
                          className="fill-muted-foreground"
                        >
                          Mascotas
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="specie" />}
              className="-translate-y-2 flex-wrap gap-2 text-sm *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="mx-4">
        <Separator className="bg-border" />
      </div>
      <CardFooter className="flex-col gap-2 text-sm">
        <CardDescription>Distribucion por especie</CardDescription>
      </CardFooter>
    </Card>
  );
}
