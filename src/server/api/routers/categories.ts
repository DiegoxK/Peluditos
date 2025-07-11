import { z } from "zod";
import {
  type CategoryDB,
  type ProductDB,
  type SubCategoryDB,
} from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ObjectId } from "mongodb";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "El ID no puede estar vacío"),
        name: z.string().min(1, "El nombre no puede estar vacío"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingCategory = await ctx.db
        .collection<CategoryDB>("categories")
        .findOne({ name: input.name });

      if (existingCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Una categoría con el nombre "${input.name}" ya existe.`,
        });
      }

      const newCategory: CategoryDB = {
        _id: new ObjectId(input.id),
        name: input.name,
      };

      const result = await ctx.db
        .collection<CategoryDB>("categories")
        .insertOne(newCategory);

      return result;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const categoriesData = await ctx.db
      .collection<CategoryDB>("categories")
      .find()
      .sort({ name: 1 })
      .toArray();

    return categoriesData.map((cat) => ({
      id: cat._id.toHexString(),
      label: cat.name,
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
      const { id, name } = input;
      const categoryId = new ObjectId(id);

      const result = await ctx.db
        .collection<CategoryDB>("categories")
        .updateOne({ _id: categoryId }, { $set: { name } });

      if (result.matchedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Categoría no encontrada.",
        });
      }

      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const categoryId = new ObjectId(input.id);

      // Before deleting, check if any products are using this category.
      const productUsingCategory = await ctx.db
        .collection<ProductDB>("products")
        .findOne({ categoryId: categoryId });

      if (productUsingCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "No se puede eliminar la categoría porque está siendo utilizada por uno o más productos.",
        });
      }

      // If the category is deleted, all its subcategories must also be deleted.
      await ctx.db
        .collection<SubCategoryDB>("subcategories")
        .deleteMany({ categoryId: categoryId });

      // Now, delete the category itself
      const result = await ctx.db
        .collection<CategoryDB>("categories")
        .deleteOne({ _id: categoryId });

      if (result.deletedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Categoría no encontrada.",
        });
      }

      return result;
    }),
});
