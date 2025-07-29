"use client";

import { CircleX } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

export const description = "A radial chart with text";

interface ShippedRadialProps {
  total: number;
  canceled: number;
}

const chartConfig = {
  canceled: {
    label: "Entregados",
  },
} satisfies ChartConfig;

export function CancelationRate({ total, canceled }: ShippedRadialProps) {
  const chartData = [
    {
      canceled,
      total,
      fill: "var(--chart-2)",
    },
  ];

  return (
    <Card className="relative">
      <CardTitle className="text-primary flex items-center gap-2">
        <CircleX strokeWidth={2.2} />
        <span className="font-semibold">Ratio de ordenes canceladas</span>
      </CardTitle>

      <div className="mx-4">
        <Separator className="bg-border" />
      </div>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square size-68 max-h-68"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={
              ((chartData[0]?.canceled ?? 0) * 360) / (chartData[0]?.total ?? 1)
            }
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="canceled" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-primary text-4xl font-bold"
                        >
                          {chartData[0]?.canceled?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 15}
                          className="fill-muted-foreground"
                        >
                          Ventas
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <div className="absolute bottom-21 left-1/2 ml-2 flex -translate-x-1/2 gap-6 text-sm">
        <span className="whitespace-nowrap before:mr-1 before:mb-[1px] before:inline-block before:h-2 before:w-2 before:rounded-md before:bg-[#95bfaf] before:content-['']">
          {chartData[0]?.total} Total
        </span>
        <span className="before:bg-chart-2 whitespace-nowrap before:mr-1 before:mb-[1px] before:inline-block before:h-2 before:w-2 before:rounded-md before:content-['']">
          {chartData[0]?.canceled} Canceladas
        </span>
      </div>
      <div className="mx-4">
        <Separator className="bg-border" />
      </div>
      <CardFooter className="flex-col gap-2 overflow-hidden text-center text-sm">
        <CardDescription className="truncate">
          Ratio de ornedes fallidas/canceladas
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
