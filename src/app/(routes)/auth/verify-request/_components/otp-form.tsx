"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/trpc/react";

import { useState } from "react";

const FormSchema = z.object({
  pin: z.string().toLowerCase().min(6, {
    message: "Tu clave de un solo uso debe tener 6 caracteres.",
  }),
});

export function InputOTPForm({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    const callbackUrl = encodeURIComponent(`${getBaseUrl()}/dashboard`);
    const token = encodeURIComponent(data.pin);
    const emailEncoded = encodeURIComponent(email);

    router.replace(
      `/api/auth/callback/email?callbackUrl=${callbackUrl}&token=${token}&email=${emailEncoded}`,
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 px-4">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="justify-center text-white">
                Clave de un solo uso.
              </FormLabel>
              <FormControl className="justify-center rounded-xl">
                <InputOTP
                  disabled={loading}
                  containerClassName="justify-center rounded-xl"
                  maxLength={6}
                  {...field}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                  <InputOTPGroup className="border-primary rounded-xl border-2 bg-white uppercase">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={loading}
          variant="secondary"
          className="w-full"
          type="submit"
        >
          Verificar
        </Button>
        <FormDescription className="text-white">
          El código fue enviado a tu correo electrónico{" "}
          <span className="text-primary-900 font-bold">{email}</span>.
        </FormDescription>
        <p className="text-primary-100 text-muted text-sm">
          *Recuerda revisar la carpeta de spam*
        </p>
      </form>
    </Form>
  );
}
