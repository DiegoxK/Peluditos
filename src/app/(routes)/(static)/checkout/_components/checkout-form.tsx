"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/hooks/store/cart-store";
import { api } from "@/trpc/react";
import { openEpaycoCheckout } from "epayco-checkout-community-sdk";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio."),
  email: z.string().email("Por favor, ingresa un correo válido."),
  phone: z.string().min(7, "El teléfono es obligatorio."),
  typeDoc: z.enum(["CC", "CE", "NIT", "PAS"], {
    required_error: "El tipo de documento es obligatorio.",
  }),
  numberDoc: z.string().min(5, "El número de documento es obligatorio."),
  address: z.string().min(5, "La dirección es obligatoria."),
  notes: z.string().optional(),
});

export default function CheckoutForm() {
  const { items } = useCartStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      typeDoc: "CC",
      numberDoc: "",
      address: "",
      notes: "",
    },
  });

  const { mutate: createSession, isPending } =
    api.orders.createPaymentSession.useMutation({
      onSuccess: async ({ sessionId }) => {
        try {
          const handler = await openEpaycoCheckout({
            sessionId,
            external: false,
          });
          handler.onResponse((data) => {
            console.log("ePayco Client-Side Response:", data);
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Error desconocido";
          toast.error("Error al abrir ePayco", { description: message });
        }
      },
      onError: (error) => {
        toast.error("Error al crear la sesión de pago", {
          description: error.message,
        });
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío.");
      return;
    }
    const cartItemsForApi = items.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
    }));
    createSession({ customerDetails: values, cartItems: cartItemsForApi });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Información de Contacto</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Jose Antonio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jose.antonio@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono Celular</FormLabel>
                  <FormControl>
                    <Input placeholder="3001234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Documento de Identidad</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="typeDoc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                      <SelectItem value="NIT">NIT</SelectItem>
                      <SelectItem value="PAS">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberDoc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Dirección de Envío</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Cundinamarca" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/* <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input placeholder="Bogotá D.C." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Calle 53 #25-30, Apto 502, Chapinero"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Notas Adicionales (Opcional)
          </h2>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observaciones</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ej: Dejar en portería, entregar después de las 5 PM..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          {isPending ? "Procesando..." : "Continuar al Pago"}
        </Button>
      </form>
    </Form>
  );
}
