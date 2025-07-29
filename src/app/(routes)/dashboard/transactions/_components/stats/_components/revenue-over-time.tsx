"use client";

import { ChartColumn } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RevenueOverTimeProps {
  registry: Record<string, { month: string; revenue: number }[]>;
}

const chartConfig = {
  revenue: {
    label: "Ganancias",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RevenueOverTime({ registry }: RevenueOverTimeProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    Object.keys(registry)[Object.keys(registry).length - 1] ?? "2025",
  );

  const years = Object.keys(registry).map((year) => ({
    value: year,
    label: year,
  }));

  const chartData = registry[value] ?? [];

  return (
    <Card>
      <div className="flex justify-between">
        <CardTitle className="text-primary flex items-center gap-2">
          <ChartColumn strokeWidth={2.2} />
          <span className="font-semibold">Ganancias este mes</span>
        </CardTitle>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="mr-4 w-[200px] justify-between"
            >
              {value
                ? years.find((year) => year.value === value)?.label
                : "Seleccionar año..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Buscar por año..." className="h-9" />
              <CommandList>
                <CommandEmpty>No se encontro año.</CommandEmpty>
                <CommandGroup>
                  {years.map((year) => (
                    <CommandItem
                      key={year.value}
                      value={year.value}
                      onSelect={(currentValue: string) => {
                        setValue(currentValue);
                        setOpen(false);
                      }}
                    >
                      {year.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === year.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="mx-4">
        <Separator className="bg-border" />
      </div>
      <CardContent>
        <ChartContainer className="max-h-68 w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -24,
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
              className=""
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="revenue"
              type="bump"
              fill="var(--color-revenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <div className="mx-4">
        <Separator className="bg-border" />
      </div>
      <CardFooter className="flex-col gap-2 text-sm">
        <CardDescription>Grafica de ganancias por mes.</CardDescription>
      </CardFooter>
    </Card>
  );
}
