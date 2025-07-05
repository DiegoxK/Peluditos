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

export const description = "A simple area chart";

const years = [
  {
    value: "2025",
    label: "2025",
  },
  {
    value: "2024",
    label: "2024",
  },
];

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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("2025");

  return (
    <Card>
      <div className="flex justify-between">
        <CardTitle className="text-primary flex items-center gap-2">
          <ChartColumn strokeWidth={2.2} />
          <span className="font-semibold">Nuevas mascotas</span>
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
                        setValue(currentValue === value ? "" : currentValue);
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
