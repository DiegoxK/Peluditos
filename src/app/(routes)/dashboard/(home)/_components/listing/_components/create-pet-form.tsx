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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import type { Pet } from "@/server/db/schema";

const formSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, { message: "El nombre no puede estar vacío." }),

  specie: z
    .string({ required_error: "La especie es obligatoria." })
    .min(1, { message: "La especie no puede estar vacía." }),

  breed: z
    .string({ required_error: "La raza es obligatoria." })
    .min(1, { message: "La raza no puede estar vacía." }),

  age: z
    .number({
      invalid_type_error: "La edad debe ser un número.",
      required_error: "La edad es obligatoria.",
    })
    .nonnegative({ message: "La edad no puede ser negativa." }),

  status: z.enum(["adoptado", "disponible", "en tratamiento"], {
    required_error: "El estado es obligatorio.",
    invalid_type_error:
      "El estado debe ser uno de: adoptado, disponible, en tratamiento.",
  }),

  image: z
    .string({ required_error: "La URL de la imagen es obligatoria." })
    .url({ message: "Debe ser una URL válida." }),

  entryDate: z.date({ required_error: "La fecha de ingreso es obligatoria." }),

  description: z
    .string({ required_error: "La descripción es obligatoria." })
    .min(1, { message: "La descripción no puede estar vacía." }),

  gender: z.enum(["Macho", "Hembra"], {
    required_error: "El género es obligatorio.",
    invalid_type_error: "El género debe ser Macho o Hembra.",
  }),

  weight: z
    .number({
      invalid_type_error: "El peso debe ser un número.",
      required_error: "El peso es obligatorio.",
    })
    .positive({ message: "El peso debe ser mayor que cero." }),

  vaccinated: z.boolean({
    invalid_type_error: "El valor de vacunado debe ser verdadero o falso.",
    required_error: "Debe indicar si está vacunado.",
  }),

  sterilized: z.boolean({
    invalid_type_error: "El valor de esterilizado debe ser verdadero o falso.",
    required_error: "Debe indicar si está esterilizado.",
  }),
});

interface CreatePetFormProps {
  pet?: Pet;
}

export default function CreatePetForm({ pet }: CreatePetFormProps) {
  const isEditMode = Boolean(pet);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pet?.name ?? "",
      specie: pet?.specie ?? "",
      breed: pet?.breed ?? "",
      age: pet?.age ?? 0,
      status: pet?.status ?? "disponible",
      image: pet?.image ?? "",
      entryDate: pet?.entryDate ? new Date(pet.entryDate) : new Date(),
      description: pet?.description ?? "",
      gender: pet?.gender ?? "Macho",
      weight: pet?.weight ?? 1,
      vaccinated: pet?.vaccinated ?? false,
      sterilized: pet?.sterilized ?? false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEditMode) {
      console.log("Updating pet:", { id: pet?._id, ...values });
      // await updatePet.mutateAsync({ id: pet.id, ...values })
    } else {
      console.log("Creating new pet:", values);
      // await createPet.mutateAsync(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-h-[60vh] space-y-4 overflow-y-scroll py-4 ps-1 pr-2">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Firulais" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona género" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Macho">Macho</SelectItem>
                      <SelectItem value="Hembra">Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Perro / Gato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Perro">Perro</SelectItem>
                      <SelectItem value="Gato">Gato</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raza</FormLabel>
                  <FormControl>
                    <Input placeholder="Labrador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edad</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="adoptado">Adoptado</SelectItem>
                      <SelectItem value="en tratamiento">
                        En tratamiento
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la imagen</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="entryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de ingreso</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full text-left">
                        {field.value
                          ? format(field.value, "dd/MM/yyyy")
                          : "Selecciona una fecha"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Información adicional del animal..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vaccinated"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <FormLabel className="text-sm font-medium">
                  ¿Vacunado?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sterilized"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <FormLabel className="text-sm font-medium">
                  ¿Esterilizado?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button type="submit">{isEditMode ? "Actualizar" : "Guardar"}</Button>

          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
