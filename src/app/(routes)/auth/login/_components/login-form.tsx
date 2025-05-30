"use client";

import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "El email no es válido",
  }),
});

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const params = useSearchParams();
  const router = useRouter();

  const error = params.get("error");

  useEffect(() => {
    if (error) {
      setIsOpen(true);
    }
  }, [error, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    void signIn("email", { email: values.email });
  }

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ocurrió un error al iniciar sesión
            </AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, intenta de nuevo o contacta a soporte si el problema
              persiste.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center space-y-3 px-4 md:w-2/4 md:px-0"
        >
          <div className="text-center">
            <h1 className="text-primary text-4xl font-bold">Iniciar Sesión</h1>
            <p className="font-light">Ingresa tu correo electrónico</p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col items-center">
                <FormMessage className="text-primary-900" />
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="jose@example.com"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={loading} className="w-full" type="submit">
            Ingresar
          </Button>
        </form>
      </Form>
    </>
  );
}
