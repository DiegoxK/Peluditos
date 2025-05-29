"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  ImageCropApplyAction,
  ImageCropCloseAction,
  ImageCropChangeAction,
  ImageCropContentArea,
  ImageCropCropper,
  ImageCropDescription,
  ImageCropFooter,
  ImageCropHeader,
  ImageCropPreview,
  ImageCropRoot,
  ImageCropTitle,
  ImageCropTrigger,
  ImageCropDeleteAction,
} from "@/components/ui/image-crop-area";
import { Cat } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { uploadFiles } from "@/lib/uploadthing";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const PetImageSchema = z.union([
  z
    .string({
      message: "La imagen de la mascota es obligatoria.",
    })
    .url({ message: "Must be a valid URL." }),
  z.instanceof(Blob, { message: "Image must be a valid file." }),
]);

const formSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, { message: "El nombre no puede estar vacío." }),

  specie: z
    .string({ required_error: "La especie es obligatoria." })
    .min(1, { message: "La especie no puede estar vacía." }),

  breed: z.string({ required_error: "La raza es obligatoria." }).optional(),

  age: z.coerce
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
  image: PetImageSchema,
  entryDate: z.date({
    required_error: "La fecha de ingreso es obligatoria.",
  }),
  description: z
    .string({ required_error: "La descripción es obligatoria." })
    .min(1, { message: "La descripción no puede estar vacía." }),

  gender: z.enum(["Macho", "Hembra"], {
    required_error: "El género es obligatorio.",
    invalid_type_error: "El género debe ser Macho o Hembra.",
  }),

  weight: z.coerce
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
  const utils = api.useUtils();

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

  const { mutate: createPet } = api.pets.createPet.useMutation({
    // Optimistically update the cache before the mutation fires
    onMutate: async (newPet) => {
      // Cancel any ongoing fetches so they don't overwrite our optimistic update
      await utils.pets.getAllPets.cancel();
      // Snapshot the current data so we can rollback later if needed
      const previousPets = utils.pets.getAllPets.getData();

      // Optimistically add the new pet to the cache
      utils.pets.getAllPets.setData(undefined, (old) => [
        ...(old ?? []),
        {
          ...newPet,
          _id: "temp-id",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      // Return context for rollback
      return { previousPets };
    },
    onSuccess: (data) => {
      console.log("Pet created successfully:", data);
    },
    onError: (error, _newPet, context) => {
      if (context?.previousPets) {
        utils.pets.getAllPets.setData(undefined, context.previousPets);
      }
      console.error("Error al crear mascota:", error);
      toast.error("Error creating pet", {
        id: "pet-form",
        duration: 4000,
      });
    },
    onSettled: () => {
      void utils.pets.getAllPets.invalidate();
      toast.success("Mascota subida exitosamente!", {
        id: "pet-form",
        duration: 4000,
      });
    },
  });

  const { mutate: updatePet } = api.pets.updatePet.useMutation({
    onMutate: async (updatedPet) => {
      await utils.pets.getAllPets.cancel();

      const previousPets = utils.pets.getAllPets.getData();

      // Optimistically update the cache
      utils.pets.getAllPets.setData(
        undefined,
        (old) =>
          old?.map((pet) =>
            pet._id === updatedPet._id
              ? { ...pet, ...updatedPet, updatedAt: new Date().toISOString() }
              : pet,
          ) ?? [],
      );

      // Return context for potential rollback
      return { previousPets };
    },

    // On error, rollback to previous state
    onError: (error, _updatedPet, context) => {
      if (context?.previousPets) {
        utils.pets.getAllPets.setData(undefined, context.previousPets);
      }
      console.error("Error updating pet:", error);
      toast.error("Error updating pet", {
        id: "pet-form",
        duration: 4000,
      });
    },

    onSuccess: (data) => {
      console.log("Pet updated successfully:", data);
    },

    onSettled: () => {
      void utils.pets.getAllPets.invalidate();
      toast.success("Mascota actualizada exitosamente!", {
        id: "pet-form",
        duration: 4000,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading(`${isEditMode ? "Actualizando" : "Creando"} mascota...`, {
      id: "pet-form",
      duration: Infinity,
    });

    const petImage = values.image;
    let finalImageUrl: string | null = null;
    let imageKey: string | null = null;

    if (petImage instanceof Blob) {
      try {
        const file = new File([petImage], `${values.name.toLowerCase()}.webp`, {
          type: "image/webp",
        });

        const res = await uploadFiles("imageUploader", { files: [file] });

        const uploadedFile = res?.[0];

        if (!uploadedFile?.ufsUrl || !uploadedFile.key) {
          console.error("Upload failed: invalid response from uploadFiles.");
          toast.error("Error al subir la imagen", {
            id: "image-upload",
            duration: 4000,
          });
          return;
        }

        finalImageUrl = uploadedFile.ufsUrl;
        imageKey = uploadedFile.key;

        console.log("Image uploaded successfully:", finalImageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error al subir la imagen", {
          id: "image-upload",
          duration: 4000,
        });
        return;
      }
    } else if (typeof petImage === "string" && petImage.trim()) {
      finalImageUrl = petImage;
      imageKey = pet?.imageKey ?? "";
      console.log("Using existing image URL:", finalImageUrl);
    } else {
      console.error("No image provided.");
      return;
    }

    const payload = {
      ...values,
      entryDate: values.entryDate.toISOString(),
      image: finalImageUrl,
      imageKey,
    };

    console.log("Submitting payload:", payload);

    if (isEditMode && pet?._id) {
      void updatePet({ _id: pet._id, ...payload });
    } else {
      void createPet(payload);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-h-[56vh] space-y-4 overflow-y-scroll py-4 ps-1 pr-2">
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
                <FormLabel>Imagen</FormLabel>
                <FormControl>
                  <ImageCropRoot
                    value={field.value}
                    onChange={field.onChange}
                    aspectRatio={1 / 1}
                    maxFileSizeMB={4}
                    outputOptions={{
                      outputType: "image/webp",
                      outputQuality: 0.8,
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <ImageCropTrigger className="w-auto" />
                        <p className="text-muted-foreground text-sm">
                          Máx 4MB. Recomendado: JPG, PNG, WEBP.
                        </p>
                      </div>

                      <ImageCropContentArea className="bg-card mx-auto w-full rounded-lg border p-4 shadow-sm sm:max-w-lg">
                        <ImageCropHeader>
                          <div className="flex-grow p-1">
                            <ImageCropTitle>Adjustar imagen</ImageCropTitle>
                            <ImageCropDescription>
                              Arrastra para recortar.
                            </ImageCropDescription>
                          </div>
                          <ImageCropCloseAction size="icon" variant="ghost" />
                        </ImageCropHeader>

                        {/* Cropper itself */}
                        <Separator className="my-4" />
                        <ImageCropCropper />
                        <p className="text-muted-foreground mt-4 text-sm">
                          La vista previa se actualiza debajo del editor.
                        </p>
                        <Separator className="my-4" />
                        <ImageCropFooter>
                          <ImageCropApplyAction>Aplicar</ImageCropApplyAction>
                          <ImageCropChangeAction>
                            Cambiar archivo
                          </ImageCropChangeAction>
                          <ImageCropDeleteAction>
                            Eliminar
                          </ImageCropDeleteAction>
                        </ImageCropFooter>
                      </ImageCropContentArea>

                      <ImageCropPreview
                        className="my-8 place-self-center rounded-full"
                        placeholder={
                          <div className="flex flex-col items-center">
                            <Cat height={45} width={45} strokeWidth={1.1} />
                            Tu mascota!
                          </div>
                        }
                      />
                    </div>
                  </ImageCropRoot>
                </FormControl>
                <FormDescription>
                  Selecciona una imagen y ajusta el recorte para la foto de la
                  mascota.
                </FormDescription>
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
          <Button disabled={!form.formState.isDirty} type="submit">
            {isEditMode ? "Actualizar" : "Guardar"}
          </Button>

          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
