import { z } from "zod";
import {
  ProductDbSchema,
  ProductSchema,
  type Product,
  type ProductDB,
} from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ObjectId, type Filter } from "mongodb";
import { utapi } from "@/server/uploadthing";
import { TRPCError } from "@trpc/server";

// TODO: Unify genetic sorting schemas with the pets route
const SortingStateSchema = z
  .array(
    z.object({
      id: z.string(),
      desc: z.boolean(),
    }),
  )
  .optional();

const FilterValueSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.number(),
  z.boolean(),
  z.null(),
  z.undefined(),
]);

const ColumnFilterSchema = z.object({
  id: z.string(),
  value: FilterValueSchema,
});

const ColumnFiltersStateSchema = z.array(ColumnFilterSchema).optional();

export const GetAllProductsInputSchema = z.object({
  pageIndex: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
  sorting: SortingStateSchema,
  globalFilter: z.string().optional(),
  columnFilters: ColumnFiltersStateSchema,
});

export const SortableProductFieldsSchema = z.enum([
  "name",
  "category",
  "subcategory",
  "price",
  "stock",
  "createdAt",
  "updatedAt",
  "sales",
  "views",
]);

export type SortableProductFields = z.infer<typeof SortableProductFieldsSchema>;

type MongoSortOptions = Partial<Record<SortableProductFields, 1 | -1>>;

export const productRouter = createTRPCRouter({
  getAllProducts: protectedProcedure
    .input(GetAllProductsInputSchema)
    .query(async ({ ctx, input }) => {
      const { pageIndex, pageSize, sorting, globalFilter, columnFilters } =
        input;

      const MONGODB_QUERY_FILTER_CONDITIONS: Filter<ProductDB> = {};

      // Global Filter
      if (globalFilter && globalFilter.trim() !== "") {
        const gFilterRegex = new RegExp(globalFilter.trim(), "i");
        MONGODB_QUERY_FILTER_CONDITIONS.$or = [
          { name: { $regex: gFilterRegex } },
          { "category.name": { $regex: gFilterRegex } },
          { "subcategory.name": { $regex: gFilterRegex } },
        ];
      }

      // Column Filters
      if (columnFilters?.length) {
        columnFilters.forEach((filter) => {
          if (filter.value !== undefined && filter.value !== null) {
            const filterKey = filter.id as keyof Filter<ProductDB>;

            if (filter.id === "category" || filter.id === "featured") {
              if (Array.isArray(filter.value) && filter.value.length > 0) {
                MONGODB_QUERY_FILTER_CONDITIONS[filterKey] = {
                  $in: filter.value,
                };
              } else if (
                (typeof filter.value === "string" &&
                  filter.value.trim() !== "") ||
                typeof filter.value === "boolean"
              ) {
                MONGODB_QUERY_FILTER_CONDITIONS[filterKey] = filter.value;
              }
            }
          }
        });
      }

      // Sorting (single-column)
      let MONGODB_SORT_OPTIONS: MongoSortOptions = { updatedAt: -1 };

      if (sorting?.length && sorting[0]) {
        const { id, desc } = sorting[0];
        const parsedSortId = SortableProductFieldsSchema.safeParse(id);

        if (parsedSortId.success) {
          const validSortKey: SortableProductFields = parsedSortId.data;
          MONGODB_SORT_OPTIONS = { [validSortKey]: desc ? -1 : 1 };
        } else {
          console.warn(
            `Invalid sort key received: "${id}". Allowed keys are: ${Object.values(
              SortableProductFieldsSchema.Values,
            ).join(", ")}. Reverting to default sort.`,
          );
        }
      }

      const aggregationPipeline = [
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "subcategory",
          },
        },
        {
          $unwind: "$subcategory",
        },
        {
          $match: MONGODB_QUERY_FILTER_CONDITIONS,
        },
        {
          $sort: MONGODB_SORT_OPTIONS,
        },
        {
          $skip: pageIndex * pageSize,
        },
        {
          $limit: pageSize,
        },
        {
          $project: {
            name: 1,
            price: 1,
            previousPrice: 1,
            stock: 1,
            createdAt: 1,
            updatedAt: 1,
            description: 1,
            features: 1,
            image: 1,
            imageKey: 1,
            sales: 1,
            views: 1,
            featured: 1,
            category: {
              id: "$category._id",
              name: "$category.name",
            },
            subcategory: {
              id: "$subcategory._id",
              name: "$subcategory.name",
            },
          },
        },
      ];

      // Execute queries
      const totalRowCount = await ctx.db
        .collection<ProductDB>("products")
        .countDocuments(MONGODB_QUERY_FILTER_CONDITIONS);

      const productsData = await ctx.db
        .collection<ProductDB>("products")
        .aggregate(aggregationPipeline)
        .toArray();

      const products = JSON.parse(JSON.stringify(productsData)) as Product[];

      return {
        data: products,
        totalRowCount,
      };
    }),

  getDashboardSummary: protectedProcedure.query(async ({ ctx }) => {
    const productsCollection = ctx.db.collection<ProductDB>("products");

    const [total, available, outOfStock] = await Promise.all([
      productsCollection.countDocuments({}),
      productsCollection.countDocuments({ stock: { $gt: 0 } }),
      productsCollection.countDocuments({ stock: 0 }),
    ]);

    return { total, available, outOfStock };
  }),

  createProduct: protectedProcedure
    .input(
      ProductDbSchema.omit({
        _id: true,
        createdAt: true,
        updatedAt: true,
        previousPrice: true,
        sales: true,
        views: true,
      }).extend({
        categoryId: z.string(),
        subcategoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newProductData = {
        ...input,
        categoryId: new ObjectId(input.categoryId),
        subcategoryId: new ObjectId(input.subcategoryId),
        previousPrice: input.price,
        sales: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await ctx.db
        .collection<ProductDB>("products")
        .insertOne(newProductData);

      return {
        acknowledged: result.acknowledged,
        insertedId: result.insertedId.toHexString(),
      };
    }),

  updateProduct: protectedProcedure
    .input(
      ProductDbSchema.omit({ createdAt: true, updatedAt: true }).extend({
        _id: z.string(),
        categoryId: z.string(),
        subcategoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { _id, ...updateData } = input;
      const objectId = new ObjectId(_id);

      const updatePayload: Partial<Omit<ProductDB, "_id" | "createdAt">> & {
        updatedAt: string;
      } = {
        ...updateData,
        categoryId: new ObjectId(updateData.categoryId),
        subcategoryId: new ObjectId(updateData.subcategoryId),
        updatedAt: new Date().toISOString(),
      };

      const previousProductDocument = await ctx.db
        .collection<ProductDB>("products")
        .findOneAndUpdate(
          { _id: objectId },
          { $set: updatePayload },
          { returnDocument: "before" },
        );

      if (!previousProductDocument) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found for update.",
        });
      }

      // TODO: Simplify image logic into a function

      // Image deletion logic
      const oldImageKey = previousProductDocument.imageKey;
      const newImage = input.image;
      const oldImage = previousProductDocument.image;

      if (oldImageKey && newImage !== oldImage) {
        try {
          await utapi.deleteFiles(oldImageKey);
          console.log("Old image deletion success:", oldImageKey);
        } catch (err) {
          console.error("Old image deletion failed:", err);
        }
      }
      return JSON.parse(
        JSON.stringify(previousProductDocument),
      ) as Product | null;
    }),

  deleteProduct: protectedProcedure
    .input(ProductSchema.pick({ _id: true }))
    .mutation(async ({ ctx, input }) => {
      const { _id } = input;
      const objectId = new ObjectId(_id);

      const deletedProductDocument = await ctx.db
        .collection<ProductDB>("products")
        .findOneAndDelete({ _id: objectId });

      if (!deletedProductDocument) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found for deletion.",
        });
      }

      if (deletedProductDocument.imageKey) {
        try {
          await utapi.deleteFiles(deletedProductDocument.imageKey);
          console.log(
            "Image deletion success:",
            deletedProductDocument.imageKey,
          );
        } catch (err) {
          console.error("Image deletion failed:", err);
        }
      }
      return JSON.parse(
        JSON.stringify(deletedProductDocument),
      ) as Product | null;
    }),
});
