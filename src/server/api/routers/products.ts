import { z } from "zod";
import {
  ProductDbSchema,
  ProductSchema,
  type CategoryDB,
  type Product,
  type ProductDB,
} from "@/server/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
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

            console.log(filter.value);

            if (filter.id === "category") {
              if (Array.isArray(filter.value) && filter.value.length > 0) {
                MONGODB_QUERY_FILTER_CONDITIONS[filterKey] = {
                  $in: filter.value.map((id) => new ObjectId(id)),
                };
              } else if (
                typeof filter.value === "string" &&
                filter.value.trim() !== ""
              ) {
                MONGODB_QUERY_FILTER_CONDITIONS[filterKey] = new ObjectId(
                  filter.value,
                );
              }
            }
            // Handle "featured"
            if (filter.id === "featured") {
              const value = filter.value;

              if (Array.isArray(value)) {
                const boolValues = value
                  .map((v) =>
                    v === "true" ? true : v === "false" ? false : null,
                  )
                  .filter((v): v is boolean => v !== null);

                if (boolValues.length > 0) {
                  MONGODB_QUERY_FILTER_CONDITIONS[filterKey] = {
                    $in: boolValues,
                  };
                }
              } else if (typeof value === "string") {
                if (value === "true" || value === "false") {
                  MONGODB_QUERY_FILTER_CONDITIONS[filterKey] = value === "true";
                }
              } else if (typeof value === "boolean") {
                MONGODB_QUERY_FILTER_CONDITIONS[filterKey] = value;
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

      console.log(MONGODB_QUERY_FILTER_CONDITIONS);

      const aggregationPipeline = [
        {
          $match: MONGODB_QUERY_FILTER_CONDITIONS,
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
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
            localField: "subcategory",
            foreignField: "_id",
            as: "subcategory",
          },
        },
        {
          $unwind: "$subcategory",
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
        sales: true,
        views: true,
      }).extend({
        category: z.string(),
        subcategory: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newProductData = {
        ...input,
        category: new ObjectId(input.category),
        subcategory: new ObjectId(input.subcategory),
        previousPrice: input.previousPrice,
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
        category: z.string(),
        subcategory: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { _id, ...updateData } = input;
      const objectId = new ObjectId(_id);

      const updatePayload: Partial<Omit<ProductDB, "_id" | "createdAt">> & {
        updatedAt: string;
      } = {
        ...updateData,
        category: new ObjectId(updateData.category),
        subcategory: new ObjectId(updateData.subcategory),
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

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const totalProductsQuery = ctx.db
      .collection<ProductDB>("products")
      .countDocuments({});

    const totalDiscountsQuery = ctx.db
      .collection<ProductDB>("products")
      .countDocuments({ $expr: { $gt: ["$previousPrice", "$price"] } });

    const totalCategoriesQuery = ctx.db
      .collection<CategoryDB>("categories")
      .countDocuments({});

    const categoryDataPipeline = [
      { $group: { _id: "$category", amount: { $sum: 1 } } },
      { $sort: { amount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          name: { $arrayElemAt: ["$categoryDetails.name", 0] },
          amount: "$amount",
        },
      },
    ];

    type CategoryDataFromDB = Array<{
      id: string;
      name: string;
      amount: number;
    }>;

    const categoryDataQuery = ctx.db
      .collection<ProductDB>("products")
      .aggregate(categoryDataPipeline)
      .toArray() as Promise<CategoryDataFromDB>;

    const topProductPipeline = [
      { $sort: { sales: -1 } },
      { $limit: 1 },
      { $project: { _id: 0, name: "$name", sales: "$sales", views: "$views" } },
    ];

    type TopProductFromDB = Array<{
      name: string;
      sales: number;
      views: number;
    }>;

    const topProductQuery = ctx.db
      .collection<ProductDB>("products")
      .aggregate(topProductPipeline)
      .toArray() as Promise<TopProductFromDB>;

    const registryPipeline = [
      { $addFields: { entryDateObject: { $toDate: "$createdAt" } } },
      {
        $group: {
          _id: {
            year: { $year: "$entryDateObject" },
            month: { $month: "$entryDateObject" },
          },
          products: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          products: "$products",
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];

    type RegistryDataFromDB = Array<{
      year: number;
      month: number;
      products: number;
    }>;

    const registryQuery = ctx.db
      .collection<ProductDB>("products")
      .aggregate(registryPipeline)
      .toArray() as Promise<RegistryDataFromDB>;

    const [
      totalProducts,
      totalDiscounts,
      totalCategories,
      categoryData,
      topProductResult,
      registryFromDB,
    ] = await Promise.all([
      totalProductsQuery,
      totalDiscountsQuery,
      totalCategoriesQuery,
      categoryDataQuery,
      topProductQuery,
      registryQuery,
    ]);

    const topProduct = topProductResult?.[0] ?? {
      name: "N/A",
      sales: 0,
      views: 0,
    };

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    type Registry = Record<string, { month: string; products: number }[]>;

    const registry = registryFromDB.reduce((registryInProgress, dbEntry) => {
      registryInProgress[dbEntry.year] ??= months.map((month) => ({
        month,
        products: 0,
      }));

      const monthIndex = dbEntry.month - 1;
      const yearArray = registryInProgress[dbEntry.year];
      const monthObject = yearArray ? yearArray[monthIndex] : undefined;

      if (monthObject) {
        monthObject.products = dbEntry.products;
      }

      return registryInProgress;
    }, {} as Registry);

    const productStats = {
      totalProducts,
      totalDiscounts,
      totalCategories,
      categoryData,
      topProduct,
      registry,
    };

    return productStats;
  }),
  getPublicProducts: publicProcedure
    .input(
      z.object({
        pageIndex: z.number().min(0).default(0),
        pageSize: z.number().min(1).max(100).default(12),
        categories: z.array(z.string()).optional(),
        subcategories: z.array(z.string()).optional(),
        sortBy: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { pageIndex, pageSize, categories, subcategories, sortBy } = input;

      const matchStage: Filter<ProductDB> = {};

      if (categories && categories.length > 0) {
        matchStage.category = { $in: categories.map((c) => new ObjectId(c)) };
      }
      if (subcategories && subcategories.length > 0) {
        matchStage.subcategory = {
          $in: subcategories.map((s) => new ObjectId(s)),
        };
      }

      let sortStage: Record<string, 1 | -1> = { createdAt: -1 };
      if (sortBy === "priceAsc") sortStage = { price: 1 };
      else if (sortBy === "priceDesc") sortStage = { price: -1 };
      else if (sortBy === "sales") sortStage = { sales: -1 };

      const productsAggregationPipeline = [
        { $match: matchStage },
        { $sort: sortStage },
        { $skip: pageIndex * pageSize },
        { $limit: pageSize },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategory",
            foreignField: "_id",
            as: "subcategoryInfo",
          },
        },
        { $unwind: "$categoryInfo" },
        { $unwind: "$subcategoryInfo" },
        {
          $project: {
            name: 1,
            price: 1,
            previousPrice: 1,
            image: 1,
            stock: 1,
            sales: 1,
            featured: 1,

            category: { id: "$categoryInfo._id", name: "$categoryInfo.name" },
            subcategory: {
              id: "$subcategoryInfo._id",
              name: "$subcategoryInfo.name",
            },
          },
        },
      ];

      const productsData = await ctx.db
        .collection<ProductDB>("products")
        .aggregate(productsAggregationPipeline)
        .toArray();
      const total = await ctx.db
        .collection<ProductDB>("products")
        .countDocuments(matchStage);

      const products = JSON.parse(JSON.stringify(productsData)) as Product[];

      return {
        items: products,
        total,
      };
    }),

  getProductById: publicProcedure
    .input(z.object({ _id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ObjectId.isValid(input._id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ID de producto inválido.",
        });
      }

      const aggregationPipeline = [
        { $match: { _id: new ObjectId(input._id) } },
        { $limit: 1 },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategory",
            foreignField: "_id",
            as: "subcategoryInfo",
          },
        },
        { $unwind: "$categoryInfo" },
        { $unwind: "$subcategoryInfo" },
        {
          $project: {
            name: 1,
            price: 1,
            previousPrice: 1,
            image: 1,
            stock: 1,
            sales: 1,
            description: 1,
            features: 1,
            featured: 1,
            category: { id: "$categoryInfo._id", name: "$categoryInfo.name" },
            subcategory: {
              id: "$subcategoryInfo._id",
              name: "$subcategoryInfo.name",
            },
          },
        },
      ];

      const results = await ctx.db
        .collection<ProductDB>("products")
        .aggregate(aggregationPipeline)
        .toArray();

      if (!results[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Producto no encontrado.",
        });
      }

      return JSON.parse(JSON.stringify(results[0])) as Product;
    }),
});
