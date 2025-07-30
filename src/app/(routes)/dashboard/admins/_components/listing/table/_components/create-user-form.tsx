"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import type { User } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useState } from "react";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";

const ROLES = ["ADMIN", "EDITOR", "READONLY"] as const;

const formSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(3, "El nombre debe tener al menos 3 caracteres."),
  email: z
    .string({ required_error: "El correo es obligatorio." })
    .email("El correo electrónico no es válido."),
  role: z.enum(ROLES),
});

interface CreateUserFormProps {
  user?: User;
}

export default function CreateUserForm({ user }: CreateUserFormProps) {
  const { closeDialog, setPreventDialogClose } = useDialog();
  const { currentQueryInput, resetToFirstPage } = useTableState();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const isEditMode = Boolean(user);
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "READONLY",
    },
  });

  const { mutate: createUser } = api.users.createUser.useMutation({
    onMutate: async (newUserApiInput) => {
      setIsFormSubmitting(true);
      setPreventDialogClose(true);
      await utils.users.getAllUsers.cancel(currentQueryInput);
      const previousUsersResponse =
        utils.users.getAllUsers.getData(currentQueryInput);

      utils.users.getAllUsers.setData(currentQueryInput, (oldResponse) => {
        if (!oldResponse) return undefined;
        const tempId = `temp-${Math.random().toString(36).slice(2, 9)}`;
        const optimisticUser: User = {
          _id: tempId,
          ...newUserApiInput,
          image: undefined,
        };
        return {
          ...oldResponse,
          data: [optimisticUser, ...oldResponse.data],
          totalRowCount: oldResponse.totalRowCount + 1,
        };
      });
      return { previousUsersResponse, queryInputUsed: currentQueryInput };
    },
    onError: (error, _newUser, context) => {
      if (context?.previousUsersResponse) {
        utils.users.getAllUsers.setData(
          context.queryInputUsed,
          context.previousUsersResponse,
        );
      }
      toast.error(`Error creando usuario: ${error.message}`);
    },
    onSettled: (_data, error) => {
      void utils.users.getAllUsers.invalidate();
      setIsFormSubmitting(false);
      setPreventDialogClose(false);
      if (!error) {
        toast.success("Usuario creado exitosamente.");
        resetToFirstPage();
        closeDialog();
      }
    },
  });

  const { mutate: updateUserRole } = api.users.updateUserRole.useMutation({
    onMutate: async (updatedUserPayload) => {
      setIsFormSubmitting(true);
      setPreventDialogClose(true);
      await utils.users.getAllUsers.cancel(currentQueryInput);
      const previousUsersResponse =
        utils.users.getAllUsers.getData(currentQueryInput);

      utils.users.getAllUsers.setData(currentQueryInput, (old) => {
        if (!old) return undefined;
        return {
          ...old,
          data: old.data.map((u) =>
            u._id === updatedUserPayload._id
              ? { ...u, ...updatedUserPayload }
              : u,
          ),
        };
      });
      return { previousUsersResponse, queryInputUsed: currentQueryInput };
    },
    onError: (error, _updatedUser, context) => {
      if (context?.previousUsersResponse) {
        utils.users.getAllUsers.setData(
          context.queryInputUsed,
          context.previousUsersResponse,
        );
      }
      toast.error(`Error actualizando rol: ${error.message}`);
    },
    onSettled: (_data, error) => {
      void utils.users.getAllUsers.invalidate();
      setIsFormSubmitting(false);
      setPreventDialogClose(false);
      if (!error) {
        toast.success("Rol de usuario actualizado.");
        closeDialog();
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEditMode && user) {
      if (values.role !== user.role) {
        updateUserRole({ _id: user._id, role: values.role });
      } else {
        closeDialog();
      }
    } else {
      createUser(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={isEditMode || isFormSubmitting}
                  />
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
                    placeholder="john.doe@example.com"
                    {...field}
                    type="email"
                    disabled={isEditMode || isFormSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol de Usuario</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isFormSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLES.map((roleValue) => (
                      <SelectItem
                        key={roleValue}
                        value={roleValue}
                        className="capitalize"
                      >
                        {roleValue.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button disabled={isFormSubmitting} variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            disabled={!form.formState.isDirty || isFormSubmitting}
            type="submit"
          >
            {isFormSubmitting
              ? "Guardando..."
              : isEditMode
                ? "Actualizar Rol"
                : "Crear Usuario"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
