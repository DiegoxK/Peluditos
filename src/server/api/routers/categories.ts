import { z } from "zod";
import { type Category, type CategoryDB } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ObjectId } from "mongodb";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
  // ======================= Categories =======================
  createCategory: protectedProcedure
    .input(
      z.object({ name: z.string().min(1, "El nombre no puede estar vacío") }),
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

      const newCategory: Omit<CategoryDB, "_id"> = {
        name: input.name,
        subCategories: [],
      };

      const result = await ctx.db
        .collection<CategoryDB>("categories")
        .insertOne(newCategory);

      return result;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const categoriesData = await ctx.db
      .collection<CategoryDB>("categories")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return JSON.parse(JSON.stringify(categoriesData)) as Category[];
  }),

  updateCategory: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
        name: z.string().min(1, "El nombre no puede estar vacío"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { _id, name } = input;
      const categoryId = new ObjectId(_id);

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

  deleteCategory: protectedProcedure
    .input(z.object({ _id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const categoryId = new ObjectId(input._id);
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

  // ======================= SubCategories =======================
  addSubCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        name: z.string().min(1, "El nombre no puede estar vacío"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryId, name } = input;
      const parentCategoryId = new ObjectId(categoryId);

      const newSubCategory = {
        _id: new ObjectId(),
        name: name,
      };

      const result = await ctx.db
        .collection<CategoryDB>("categories")
        .updateOne(
          { _id: parentCategoryId },
          { $push: { subCategories: newSubCategory } },
        );

      if (result.matchedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Categoría padre no encontrada.",
        });
      }

      return { ...result, insertedId: newSubCategory._id.toHexString() };
    }),

  updateSubCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        subCategoryId: z.string(),
        name: z.string().min(1, "El nombre no puede estar vacío"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryId, subCategoryId, name } = input;
      const parentCategoryId = new ObjectId(categoryId);
      const subCatId = new ObjectId(subCategoryId);

      const result = await ctx.db
        .collection<CategoryDB>("categories")
        .updateOne(
          { _id: parentCategoryId, "subCategories._id": subCatId },
          { $set: { "subCategories.$.name": name } },
        );

      if (result.matchedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subcategoría o categoría padre no encontrada.",
        });
      }
      return result;
    }),

  deleteSubCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        subCategoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryId, subCategoryId } = input;
      const parentCategoryId = new ObjectId(categoryId);
      const subCatId = new ObjectId(subCategoryId);

      const result = await ctx.db
        .collection<CategoryDB>("categories")
        .updateOne(
          { _id: parentCategoryId },
          { $pull: { subCategories: { _id: subCatId } } },
        );

      if (result.matchedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Categoría padre no encontrada.",
        });
      }
      if (result.modifiedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subcategoría no encontrada para eliminar.",
        });
      }

      return result;
    }),
});
