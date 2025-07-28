import { z } from "zod";
import { OrderSchema, type Order, type OrderDB } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ObjectId, type Filter } from "mongodb";
import { TRPCError } from "@trpc/server";

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

export const GetAllOrdersInputSchema = z.object({
  pageIndex: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
  sorting: SortingStateSchema,
  globalFilter: z.string().optional(),
  columnFilters: ColumnFiltersStateSchema,
});

export const SortableOrderFieldsSchema = z.enum([
  "orderId",
  "customer.name",
  "total",
  "paymentStatus",
  "orderStatus",
  "createdAt",
]);

export type SortableOrderFields = z.infer<typeof SortableOrderFieldsSchema>;

type MongoSortOptions = Partial<Record<SortableOrderFields, 1 | -1>>;

const createOrderId = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length)),
  ).join("");

  const randomNumber = Math.floor(Math.random() * 1000);

  const randomNumbers = String(randomNumber).padStart(3, "0");

  return `${randomLetters}-${randomNumbers}`;
};

export const orderRouter = createTRPCRouter({
  getAllOrders: protectedProcedure
    .input(GetAllOrdersInputSchema)
    .query(async ({ ctx, input }) => {
      const { pageIndex, pageSize, sorting, globalFilter, columnFilters } =
        input;

      const MONGODB_QUERY_FILTER_CONDITIONS: Filter<OrderDB> = {};

      // Global Filter
      if (globalFilter && globalFilter.trim() !== "") {
        const gFilterRegex = new RegExp(globalFilter.trim(), "i");
        MONGODB_QUERY_FILTER_CONDITIONS.$or = [
          { orderId: { $regex: gFilterRegex } },
          { "customer.name": { $regex: gFilterRegex } },
          { "customer.email": { $regex: gFilterRegex } },
        ];
      }

      // Column Filters
      if (columnFilters?.length) {
        columnFilters.forEach((filter) => {
          if (filter.value !== undefined && filter.value !== null) {
            const filterKey = filter.id as keyof Filter<OrderDB>;

            if (filter.id === "orderStatus" || filter.id === "paymentStatus") {
              if (Array.isArray(filter.value) && filter.value.length > 0) {
                MONGODB_QUERY_FILTER_CONDITIONS[filterKey] = {
                  $in: filter.value,
                };
              }
            }
          }
        });
      }

      // Sorting (single-column)
      let MONGODB_SORT_OPTIONS: MongoSortOptions = { createdAt: -1 };

      if (sorting?.length && sorting[0]) {
        const { id, desc } = sorting[0];
        const parsedSortId = SortableOrderFieldsSchema.safeParse(id);

        if (parsedSortId.success) {
          const validSortKey: SortableOrderFields = parsedSortId.data;
          MONGODB_SORT_OPTIONS = { [validSortKey]: desc ? -1 : 1 };
        } else {
          console.warn(
            `Invalid sort key received: "${id}". Allowed keys are: ${Object.values(SortableOrderFieldsSchema.Values).join(", ")}. Reverting to default sort.`,
          );
        }
      }

      // Execute queries
      const totalRowCount = await ctx.db
        .collection<OrderDB>("orders")
        .countDocuments(MONGODB_QUERY_FILTER_CONDITIONS);

      const ordersData = await ctx.db
        .collection<OrderDB>("orders")
        .find(MONGODB_QUERY_FILTER_CONDITIONS)
        .sort(MONGODB_SORT_OPTIONS)
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .toArray();

      const orders = JSON.parse(JSON.stringify(ordersData)) as Order[];

      return {
        data: orders,
        totalRowCount,
      };
    }),

  createOrder: protectedProcedure
    .input(OrderSchema.omit({ _id: true, orderId: true, createdAt: true }))
    .mutation(async ({ ctx, input }) => {
      const newOrderId = createOrderId();

      const newOrderData = {
        ...input,
        orderId: newOrderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await ctx.db
        .collection<OrderDB>("orders")
        .insertOne(newOrderData);

      return {
        acknowledged: result.acknowledged,
        insertedId: result.insertedId.toHexString(),
      };
    }),
  updateOrderNotes: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
        notes: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { _id, notes } = input;
      const objectId = new ObjectId(_id);

      const result = await ctx.db
        .collection<OrderDB>("orders")
        .updateOne(
          { _id: objectId },
          { $set: { notes: notes, updatedAt: new Date().toISOString() } },
        );

      if (result.matchedCount === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }

      return { success: true, modifiedCount: result.modifiedCount };
    }),

  markOrderAsShipped: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
        shipping: OrderSchema.shape.shipping,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { _id, shipping } = input;
      const objectId = new ObjectId(_id);

      const result = await ctx.db.collection<OrderDB>("orders").updateOne(
        { _id: objectId },
        {
          $set: {
            orderStatus: "shipped",
            shipping: shipping,
            updatedAt: new Date().toISOString(),
          },
        },
      );

      if (result.matchedCount === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }

      return { success: true, modifiedCount: result.modifiedCount };
    }),
});
