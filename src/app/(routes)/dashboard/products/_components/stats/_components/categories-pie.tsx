"use client";

import { Box } from "lucide-react";
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

type CategoryData = {
  id: string;
  name: string;
  amount: number;
};

interface CategoriesPieProps {
  total: number;
  categories: CategoryData[];
}

export function CategoriesPie({ categories, total }: CategoriesPieProps) {
  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  const chartConfig = categories.reduce((config, category) => {
    config[category.id] = {
      label: category.name,
    };
    return config;
  }, {} as ChartConfig) satisfies ChartConfig;

  const chartData = categories.map((category, index) => ({
    id: category.id,
    category: category.name,
    amount: category.amount,
    fill: chartColors[index],
  }));

  return (
    <Card>
      <CardTitle className="text-primary flex items-center gap-2">
        <Box strokeWidth={2.2} />
        <span className="font-semibold">Top 5 Categorias</span>
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
              nameKey="id"
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
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 12}
                          className="fill-muted-foreground"
                        >
                          Categorias
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="id" className="truncate" />}
              className="-translate-y-2 flex-wrap gap-2 text-sm *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="mx-4">
        <Separator className="bg-border" />
      </div>
      <CardFooter className="flex-col gap-2 text-sm">
        <CardDescription>Distribucion Top 5 categorias</CardDescription>
      </CardFooter>
    </Card>
  );
}
