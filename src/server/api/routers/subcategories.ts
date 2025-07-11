import { z } from "zod";
import { type SubCategoryDB, type ProductDB } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ObjectId } from "mongodb";
import { TRPCError } from "@trpc/server";

export const subCategoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "El ID no puede estar vacío"),
        name: z.string().min(1, "El nombre no puede estar vacío"),
        categoryId: z.string().min(1, "Debe seleccionar una categoría padre."),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const parentCategoryId = new ObjectId(input.categoryId);

      const existingSubCategory = await ctx.db
        .collection<SubCategoryDB>("subcategories")
        .findOne({ name: input.name, categoryId: parentCategoryId });

      if (existingSubCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Ya existe una subcategoría con ese nombre en esta categoría.`,
        });
      }

      const newSubCategory: SubCategoryDB = {
        _id: new ObjectId(input.id),
        name: input.name,
        categoryId: parentCategoryId,
      };

      const result = await ctx.db
        .collection<SubCategoryDB>("subcategories")
        .insertOne(newSubCategory);

      return result;
    }),

  getByCategoryId: protectedProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!input.categoryId) {
        return [];
      }

      const parentCategoryId = new ObjectId(input.categoryId);
      const subCategoriesData = await ctx.db
        .collection<SubCategoryDB>("subcategories")
        .find({ categoryId: parentCategoryId })
        .sort({ name: 1 })
        .toArray();

      return subCategoriesData.map((sub) => ({
        id: sub._id.toHexString(),
        label: sub.name,
      }));
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "El nombre no puede estar vacío"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const subCategoryId = new ObjectId(input.id);

      const result = await ctx.db
        .collection<SubCategoryDB>("subcategories")
        .updateOne({ _id: subCategoryId }, { $set: { name: input.name } });

      if (result.matchedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subcategoría no encontrada.",
        });
      }

      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const subCategoryId = new ObjectId(input.id);

      // Before deleting, check if any products are using this subcategory.
      const productUsingSubCategory = await ctx.db
        .collection<ProductDB>("products")
        .findOne({ subcategoryId: subCategoryId });

      if (productUsingSubCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "No se puede eliminar la subcategoría porque está siendo utilizada por uno o más productos.",
        });
      }

      const result = await ctx.db
        .collection<SubCategoryDB>("subcategories")
        .deleteOne({ _id: subCategoryId });

      if (result.deletedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subcategoría no encontrada.",
        });
      }

      return result;
    }),
});
