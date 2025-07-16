"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ObjectId } from "bson";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import type { Product } from "@/server/db/schema";
import {
  ImageCropApplyAction,
  ImageCropCloseAction,
  ImageCropChangeAction,
  ImageCropContentArea,
  ImageCropCropper,
  ImageCropFooter,
  ImageCropHeader,
  ImageCropPreview,
  ImageCropRoot,
  ImageCropTitle,
  ImageCropTrigger,
  ImageCropDescription,
} from "@/components/ui/image-crop-area";
import { Package as PackageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { uploadFiles } from "@/lib/uploadthing";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useState } from "react";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";
import { FeatureInput } from "@/components/ui/feature-input";
import { CrudCombobox } from "@/components/ui/crud-combobox";

const ProductImageSchema = z.union([
  z
    .string({
      message: "La imagen del producto es obligatoria.",
    })
    .url({ message: "Debe ser una URL válida." }),
  z.instanceof(Blob, { message: "La imagen debe ser un archivo válido." }),
]);

const formSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, { message: "El nombre no puede estar vacío." }),
  category: z
    .string({ required_error: "La categoría es obligatoria." })
    .min(1, { message: "La categoría no puede estar vacía." }),
  subcategory: z
    .string({ required_error: "La subcategoría es obligatoria." })
    .min(1, { message: "La subcategoría no puede estar vacía." }),
  price: z.coerce
    .number({
      invalid_type_error: "El precio debe ser un número.",
      required_error: "El precio es obligatorio.",
    })
    .positive({ message: "El precio debe ser mayor a cero." }),
  previousPrice: z.coerce
    .number({
      invalid_type_error: "El precio debe ser un número.",
      required_error: "El precio es obligatorio.",
    })
    .positive({ message: "El precio debe ser mayor a cero." }),
  stock: z.coerce
    .number({
      invalid_type_error: "El stock debe ser un número.",
      required_error: "El stock es obligatorio.",
    })
    .int({ message: "El stock debe ser un número entero." })
    .nonnegative({ message: "El stock no puede ser negativo." }),
  description: z
    .string({ required_error: "La descripción es obligatoria." })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres." }),

  features: z.array(z.string()),
  image: ProductImageSchema,
  featured: z.boolean(),
});

type ProductFormData = z.infer<typeof formSchema>;

interface CreateProductFormProps {
  product?: Product;
}

export default function CreateProductForm({ product }: CreateProductFormProps) {
  const { closeDialog, setPreventDialogClose } = useDialog();
  const { currentQueryInput, resetToFirstPage } = useTableState();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const isEditMode = Boolean(product);
  const utils = api.useUtils();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? "",
      category: product?.category.id ?? "",
      subcategory: product?.subcategory.id ?? "",
      price: product?.price ?? 0,
      previousPrice: product?.previousPrice ?? 0,
      stock: product?.stock ?? 0,
      description: product?.description ?? "",
      features: product?.features ?? [],
      image: product?.image ?? "",
      featured: product?.featured ?? false,
    },
  });

  console.log(form.getValues());

  const selectedCategoryId = form.watch("category");

  // ================== Categories Calls ======================

  const { data: categories, isPending: isCategoriesPending } =
    api.categories.getAll.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const { mutate: createCategory } = api.categories.create.useMutation({
    onMutate: async (newCategory) => {
      await utils.categories.getAll.cancel();
      const previousCategories = utils.categories.getAll.getData();

      utils.categories.getAll.setData(undefined, (oldCategories) => {
        if (!oldCategories) return undefined;

        const newCategoryOption = {
          id: newCategory.id,
          label: newCategory.name,
        };

        const updatedCategories = [...oldCategories, newCategoryOption];

        return updatedCategories.sort((a, b) => a.label.localeCompare(b.label));
      });

      form.setValue("category", newCategory.id);

      return { previousCategories };
    },
    onSuccess: (_data, variables) => {
      console.log("Category created successfully:", variables.name);
    },
    onError: (error, _variables, context) => {
      console.error("Error creating category:", error);
      toast.error(`Error creando categoría: ${error.message}`);

      utils.categories.getAll.setData(
        undefined,
        context?.previousCategories ?? [],
      );
    },
  });

  const { mutate: updateCategory } = api.categories.update.useMutation({
    onMutate: async (updatedCategory) => {
      await utils.categories.getAll.cancel();
      const previousCategories = utils.categories.getAll.getData();

      utils.categories.getAll.setData(undefined, (oldCategories) => {
        if (!oldCategories) return undefined;

        const updatedCategories = oldCategories.map((cat) =>
          cat.id === updatedCategory.id
            ? { ...cat, label: updatedCategory.name }
            : cat,
        );

        return updatedCategories.sort((a, b) => a.label.localeCompare(b.label));
      });

      return { previousCategories };
    },
    onSuccess: (_data, variables) => {
      console.log("Category updated successfully:", variables.name);
    },
    onError: (error, _variables, context) => {
      console.error("Error updating category:", error);
      toast.error(`Error actualizando categoría: ${error.message}`);

      utils.categories.getAll.setData(
        undefined,
        context?.previousCategories ?? [],
      );
    },
  });

  const { mutate: deleteCategory } = api.categories.delete.useMutation({
    onMutate: async (deletedCategory) => {
      await utils.categories.getAll.cancel();
      const previousCategories = utils.categories.getAll.getData();

      utils.categories.getAll.setData(undefined, (oldCategories) => {
        if (!oldCategories) return undefined;

        return oldCategories.filter((cat) => cat.id !== deletedCategory.id);
      });

      return { previousCategories };
    },
    onSuccess: (_data, variables) => {
      console.log("Category deleted successfully:", variables.id);
    },
    onError: (error, _variables, context) => {
      console.error("Error deleting category:", error);
      toast.error(`Error eliminando categoría: ${error.message}`);

      utils.categories.getAll.setData(
        undefined,
        context?.previousCategories ?? [],
      );
    },
  });

  // ================== Subcategories Calls ======================

  const { data: subCategories, isPending: isSubCategoriesPending } =
    api.subCategories.getByCategoryId.useQuery(
      { categoryId: selectedCategoryId },
      {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: Boolean(selectedCategoryId),
      },
    );

  const { mutate: createSubCategory } = api.subCategories.create.useMutation({
    onMutate: async (newSubCategory) => {
      await utils.subCategories.getByCategoryId.cancel({
        categoryId: newSubCategory.categoryId,
      });
      const previousSubCategories = utils.subCategories.getByCategoryId.getData(
        {
          categoryId: newSubCategory.categoryId,
        },
      );

      utils.subCategories.getByCategoryId.setData(
        { categoryId: newSubCategory.categoryId },
        (oldSubCategories) => {
          if (!oldSubCategories) return undefined;

          const newSubCategoryOption = {
            id: newSubCategory.id,
            categoryId: newSubCategory.categoryId,
            label: newSubCategory.name,
          };

          const updatedSubCategories = [
            ...oldSubCategories,
            newSubCategoryOption,
          ];

          return updatedSubCategories.sort((a, b) =>
            a.label.localeCompare(b.label),
          );
        },
      );

      form.setValue("subcategory", newSubCategory.id);

      return { previousSubCategories };
    },
    onSuccess: (_data, variables) => {
      console.log("Category created successfully:", variables.name);
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      toast.error(`Error creando categoría: ${error.message}`);
    },
  });

  const { mutate: updateSubCategory } = api.subCategories.update.useMutation({
    onMutate: async (updatedSubCategory) => {
      await utils.subCategories.getByCategoryId.cancel({
        categoryId: selectedCategoryId,
      });
      const previousSubCategories = utils.subCategories.getByCategoryId.getData(
        { categoryId: selectedCategoryId },
      );
      utils.subCategories.getByCategoryId.setData(
        { categoryId: selectedCategoryId },
        (oldSubCategories) => {
          if (!oldSubCategories) return undefined;

          const updatedCategories = oldSubCategories.map((sub) =>
            sub.id === updatedSubCategory.id
              ? { ...sub, label: updatedSubCategory.name }
              : sub,
          );

          return updatedCategories.sort((a, b) =>
            a.label.localeCompare(b.label),
          );
        },
      );

      form.setValue("subcategory", updatedSubCategory.id);

      return { previousSubCategories };
    },
    onSuccess: (_data, variables) => {
      console.log("Subcategory updated successfully:", variables.name);
    },
    onError: (error, _variables, context) => {
      console.error("Error updating subcategory:", error);
      toast.error(`Error actualizando subcategoría: ${error.message}`);

      utils.subCategories.getByCategoryId.setData(
        { categoryId: selectedCategoryId },
        context?.previousSubCategories ?? [],
      );
    },
  });
  const { mutate: deleteSubCategory } = api.subCategories.delete.useMutation({
    onMutate: async (deletedSubCategory) => {
      await utils.subCategories.getByCategoryId.cancel({
        categoryId: selectedCategoryId,
      });
      const previousSubCategories = utils.subCategories.getByCategoryId.getData(
        { categoryId: selectedCategoryId },
      );
      utils.subCategories.getByCategoryId.setData(
        { categoryId: selectedCategoryId },
        (oldSubCategories) => {
          if (!oldSubCategories) return undefined;

          return oldSubCategories.filter(
            (sub) => sub.id !== deletedSubCategory.id,
          );
        },
      );
      return { previousSubCategories };
    },
    onSuccess: (_data, variables) => {
      console.log("Subcategory deleted successfully:", variables.id);
    },
    onError: (error, _variables, context) => {
      console.error("Error deleting subcategory:", error);
      toast.error(`Error eliminando subcategoría: ${error.message}`);

      utils.subCategories.getByCategoryId.setData(
        { categoryId: selectedCategoryId },
        context?.previousSubCategories ?? [],
      );
    },
  });

  // ================== Product Calls ======================

  const { mutate: createProduct } = api.products.createProduct.useMutation({
    onMutate: async (newProductApiInput) => {
      await utils.products.getAllProducts.cancel(currentQueryInput);
      const previousProductsResponse =
        utils.products.getAllProducts.getData(currentQueryInput);

      utils.products.getAllProducts.setData(
        currentQueryInput,
        (oldResponse) => {
          if (!oldResponse) return undefined;

          const tempId = "temp-" + Math.random().toString(36).slice(2, 9);
          const optimisticProductEntry: Product = {
            ...newProductApiInput,
            _id: tempId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            previousPrice: newProductApiInput.price,
            category: {
              id: newProductApiInput.category,
              name:
                categories?.find(
                  (cat) => cat.id === newProductApiInput.category,
                )?.label ?? "Categoría desconocida",
            },
            subcategory: {
              id: newProductApiInput.subcategory,
              name:
                subCategories?.find(
                  (sub) => sub.id === newProductApiInput.subcategory,
                )?.label ?? "Subcategoría desconocida",
            },
            sales: 0,
            views: 0,
          };

          return {
            ...oldResponse,
            data: [optimisticProductEntry, ...oldResponse.data],
            totalRowCount: oldResponse.totalRowCount + 1,
          };
        },
      );
      return { previousProductsResponse, queryInputUsed: currentQueryInput };
    },
    onSuccess: (data) => console.log("Product created successfully:", data),
    onError: (error, _newProduct, context) => {
      if (context?.previousProductsResponse) {
        utils.products.getAllProducts.setData(
          context.queryInputUsed,
          context.previousProductsResponse,
        );
      }
      toast.error(`Error creando producto: ${error.message}`, {
        id: "product-form",
      });
    },
    onSettled: (_data, error) => {
      void utils.products.getAllProducts.invalidate();
      void utils.products.getDashboardSummary.invalidate();
      setPreventDialogClose(false);

      if (!error) {
        toast.success("Producto creado exitosamente!", { id: "product-form" });
        resetToFirstPage();
        closeDialog();
      }
    },
  });

  const { mutate: updateProduct } = api.products.updateProduct.useMutation({
    onMutate: async (updatedProductPayload) => {
      await utils.products.getAllProducts.cancel(currentQueryInput);
      const previousProductsResponse =
        utils.products.getAllProducts.getData(currentQueryInput);

      utils.products.getAllProducts.setData(
        currentQueryInput,
        (oldResponse) => {
          if (!oldResponse) return undefined;

          const optimisticProductEntry = oldResponse.data.find((product) =>
            product._id === updatedProductPayload._id
              ? {
                  ...product,
                  ...updatedProductPayload,
                  category: {
                    id: updatedProductPayload.category,
                    name:
                      categories?.find(
                        (cat) => cat.id === updatedProductPayload.category,
                      )?.label ?? "Categoría desconocida",
                  },
                  subcategory: {
                    id: updatedProductPayload.subcategory,
                    name:
                      subCategories?.find(
                        (sub) => sub.id === updatedProductPayload.subcategory,
                      )?.label ?? "Subcategoría desconocida",
                  },
                }
              : product,
          );

          if (!optimisticProductEntry) {
            console.error("Product not found for optimistic update");
            return oldResponse;
          }

          return {
            ...oldResponse,
            data: oldResponse.data.map((product) =>
              product._id === updatedProductPayload._id
                ? optimisticProductEntry
                : product,
            ),
          };
        },
      );

      return { previousProductsResponse, queryInputUsed: currentQueryInput };
    },
    onError: (error, _updatedPet, context) => {
      if (context?.previousProductsResponse) {
        utils.products.getAllProducts.setData(
          context.queryInputUsed,
          context.previousProductsResponse,
        );
      }
      toast.error(`Error actualizando producto: ${error.message}`);
    },
    onSuccess: (data) => console.log("Product updated successfully:", data),
    onSettled: (_data, error) => {
      void utils.products.getAllProducts.invalidate();
      void utils.products.getDashboardSummary.invalidate();

      if (!error) {
        toast.success("Producto actualizado exitosamente!", {
          id: "product-form",
        });
        resetToFirstPage();
        closeDialog();
      }
      resetToFirstPage();
      setIsFormSubmitting(false);
      if (!error) closeDialog();
    },
  });

  // ================= Form Submission ======================

  async function onSubmit(values: ProductFormData) {
    setIsFormSubmitting(true);
    if (isEditMode) {
      toast.loading("Actualizando producto...", { id: "product-form" });
    } else {
      toast.loading("Creando producto...", { id: "product-form" });
      setPreventDialogClose(true);
    }

    const productImage = values.image;
    let finalImageUrl: string | null = null;
    let imageKey: string | null = null;

    if (productImage instanceof Blob) {
      try {
        const file = new File(
          [productImage],
          `${values.name.toLowerCase().replace(/\s+/g, "-")}.webp`,
          {
            type: "image/webp",
          },
        );
        const res = await uploadFiles("imageUploader", { files: [file] });
        const uploadedFile = res?.[0];

        if (!uploadedFile?.ufsUrl || !uploadedFile.key)
          throw new Error("Fallo en la subida de imagen.");

        finalImageUrl = uploadedFile.ufsUrl;
        imageKey = uploadedFile.key;
        toast.success("Imagen subida con éxito!", { id: "image-upload" });
      } catch (error) {
        toast.error("Error al subir la imagen.", { id: "image-upload" });
        setIsFormSubmitting(false);
        setPreventDialogClose(false);
        return;
      }
    } else if (typeof productImage === "string" && productImage.trim()) {
      finalImageUrl = productImage;
      imageKey = product?.imageKey ?? "";
    } else {
      toast.error("La imagen es obligatoria.");
      setIsFormSubmitting(false);
      setPreventDialogClose(false);
      return;
    }

    const payload = {
      ...values,
      image: finalImageUrl,
      imageKey: imageKey,
    };

    if (isEditMode && product?._id) {
      void updateProduct({
        _id: product._id,
        ...payload,
        previousPrice: product.previousPrice,
        sales: product.sales,
        views: product.views,
      });
    } else {
      void createProduct(payload);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-h-[65vh] space-y-4 overflow-y-scroll py-2 ps-1 pr-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto</FormLabel>
                <FormControl>
                  <Input placeholder="Collar de cuero para perros" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria principal</FormLabel>
                  <FormControl>
                    <CrudCombobox
                      disabled={isCategoriesPending}
                      options={categories ?? []}
                      placeholder={
                        isCategoriesPending ? "Cargando..." : "Categoría"
                      }
                      searchPlaceholder=" Buscar o crear..."
                      addPlaceholder="Agregar nueva categoría"
                      onAdd={(label) => {
                        createCategory({
                          id: new ObjectId().toHexString(),
                          name: label,
                        });
                      }}
                      onEdit={(option) => {
                        updateCategory({
                          id: option.id,
                          name: option.label,
                        });
                      }}
                      onDelete={(id) => {
                        deleteCategory({ id });
                      }}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem className="overflow-hidden">
                  <FormLabel>Subcategoría</FormLabel>
                  <FormControl>
                    <CrudCombobox
                      options={subCategories ?? []}
                      disabled={!selectedCategoryId || isSubCategoriesPending}
                      placeholder="Subcategoría"
                      searchPlaceholder="Buscar o crear..."
                      addPlaceholder="Agregar nueva subcategoría"
                      onAdd={(label) => {
                        createSubCategory({
                          id: new ObjectId().toHexString(),
                          categoryId: selectedCategoryId,
                          name: label,
                        });
                      }}
                      onEdit={(option) => {
                        updateSubCategory({
                          id: option.id,
                          name: option.label,
                        });
                      }}
                      onDelete={(id) => {
                        deleteSubCategory({
                          id,
                        });
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="10"
                      onWheel={(e) => {
                        e.currentTarget.blur();
                      }}
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="previousPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio anterior</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="10"
                      onWheel={(e) => {
                        e.currentTarget.blur();
                      }}
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock disponible</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    onWheel={(e) => {
                      e.currentTarget.blur();
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen del Producto</FormLabel>
                <FormControl>
                  <ImageCropRoot
                    value={field.value}
                    onChange={field.onChange}
                    aspectRatio={1 / 1}
                    maxFileSizeMB={4}
                    outputOptions={{
                      outputType: "image/webp",
                      outputQuality: 0.7,
                    }}
                  >
                    <div className="space-y-4">
                      <ImageCropTrigger className="w-full" />
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
                        <Separator className="my-4" />
                        <ImageCropCropper />
                        <p className="text-muted-foreground mt-4 text-sm">
                          La vista previa se actualiza debajo del editor.
                        </p>
                        <Separator className="my-4" />
                        <ImageCropFooter>
                          <ImageCropChangeAction>
                            Cambiar imagen
                          </ImageCropChangeAction>
                          <ImageCropApplyAction>Aplicar</ImageCropApplyAction>
                        </ImageCropFooter>
                      </ImageCropContentArea>
                      <ImageCropPreview
                        className="my-8 h-54 w-54 place-self-center rounded-lg border"
                        placeholder={
                          <div className="flex flex-col items-center justify-center gap-1">
                            <PackageIcon strokeWidth={1.2} size={48} />
                            <span>Producto</span>
                          </div>
                        }
                      />
                    </div>
                  </ImageCropRoot>
                </FormControl>
                <FormDescription>
                  Selecciona y recorta la imagen principal del producto.
                </FormDescription>
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
                    placeholder="Describe el producto, sus materiales, uso, etc."
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caracteristicas</FormLabel>
                  <FormControl>
                    <FeatureInput
                      placeholder="Ingrese las caracteristicas del producto..."
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-medium">
                    Producto Destacado
                  </FormLabel>
                  <FormDescription>
                    Si se activa, aparecerá en la sección principal de la
                    tienda.
                  </FormDescription>
                </div>
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

        <DialogFooter className="mt-6">
          <Button
            disabled={
              (!form.formState.isDirty && isEditMode) || isFormSubmitting
            }
            type="submit"
          >
            {isEditMode ? "Actualizar Producto" : "Guardar Producto"}
          </Button>
          <DialogClose asChild>
            <Button disabled={isFormSubmitting} variant="outline">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
