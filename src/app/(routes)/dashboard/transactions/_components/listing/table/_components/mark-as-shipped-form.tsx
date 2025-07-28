"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";
import { cn } from "@/lib/utils";
import type { Order } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  company: z
    .string({
      required_error: "Debe seleccionar una empresa de envío.",
    })
    .min(1, "Debe seleccionar una empresa de envío."),
  code: z
    .string()
    .min(3, "El código de seguimiento debe tener al menos 3 caracteres."),
  estimatedDate: z
    .string({
      required_error: "Debe seleccionar una fecha estimada.",
    })
    .min(1, "Debe seleccionar una fecha estimada."),
});

const shippingCompanies = [
  "Servientrega",
  "Interrapidísimo",
  "Coordinadora",
  "Envía",
] as const;

interface MarkAsShippedFormProps {
  order: Order;
}

export default function MarkAsShippedForm({ order }: MarkAsShippedFormProps) {
  const { closeDialog, setPreventDialogClose } = useDialog();
  const { currentQueryInput } = useTableState();
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      company: order.shipping.company || "",
      code: order.shipping.code || "",
      estimatedDate: order.shipping.estimatedDate || "",
    },
  });

  const { mutate: markAsShipped, isPending } =
    api.orders.markOrderAsShipped.useMutation({
      onMutate: () => setPreventDialogClose(true),
      onError: (err) =>
        toast.error("Error al marcar como enviado:", {
          description: err.message,
        }),
      onSuccess: () => {
        toast.success("Pedido marcado como enviado.");
        void utils.orders.getAllOrders.invalidate(currentQueryInput);
        closeDialog();
      },
      onSettled: () => setPreventDialogClose(false),
    });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    markAsShipped({ _id: order._id, shipping: data });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa de Envío</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {shippingCompanies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Seguimiento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SER78945612"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha Estimada</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        disabled={isPending}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar y Marcar como Enviado"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
