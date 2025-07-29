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

  getDashboardSummary: protectedProcedure.query(async ({ ctx }) => {
    const totalOrdersQuery = ctx.db
      .collection<OrderDB>("orders")
      .countDocuments({});

    const shippedQuery = ctx.db.collection<OrderDB>("orders").countDocuments({
      orderStatus: { $in: ["enviado", "entregado"] },
    });

    const revenuePipeline = [
      {
        $match: {
          orderStatus: { $ne: "cancelado" },
          paymentStatus: "aprobado",
        },
      },

      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ];

    type RevenueResult = { totalRevenue: number };

    const totalRevenueQuery = ctx.db
      .collection<OrderDB>("orders")
      .aggregate(revenuePipeline)
      .toArray() as Promise<RevenueResult[]>;

    const [totalOrders, shipped, revenueResult] = await Promise.all([
      totalOrdersQuery,
      shippedQuery,
      totalRevenueQuery,
    ]);

    const totalRevenue = revenueResult?.[0]?.totalRevenue ?? 0;

    return {
      totalOrders,
      shipped,
      totalRevenue,
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
            orderStatus: "enviado",
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
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const totalOrdersQuery = ctx.db
      .collection<OrderDB>("orders")
      .countDocuments({});

    const statusesPipeline = [
      { $group: { _id: "$orderStatus", amount: { $sum: 1 } } },
    ];
    const statusesQuery = ctx.db
      .collection<OrderDB>("orders")
      .aggregate(statusesPipeline)
      .toArray();

    const shippedTotalQuery = ctx.db
      .collection<OrderDB>("orders")
      .countDocuments({
        orderStatus: { $in: ["enviado", "entregado"] },
      });

    const deliveredQuery = ctx.db.collection<OrderDB>("orders").countDocuments({
      orderStatus: "entregado",
    });

    const revenuePipeline = [
      {
        $match: {
          orderStatus: { $ne: "cancelado" },
          paymentStatus: "aprobado",
        },
      },
      { $addFields: { dateObject: { $toDate: "$createdAt" } } },
      {
        $group: {
          _id: {
            year: { $year: "$dateObject" },
            month: { $month: "$dateObject" },
          },
          revenue: { $sum: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          revenue: "$revenue",
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];

    type RevenueDataFromDB = Array<{
      year: number;
      month: number;
      revenue: number;
    }>;

    const revenueQuery = ctx.db
      .collection<OrderDB>("orders")
      .aggregate(revenuePipeline)
      .toArray() as Promise<RevenueDataFromDB>;

    const [
      totalOrders,
      statusesFromDB,
      shippedTotal,
      delivered,
      revenueFromDB,
    ] = await Promise.all([
      totalOrdersQuery,
      statusesQuery,
      shippedTotalQuery,
      deliveredQuery,
      revenueQuery,
    ]);

    const statuses = statusesFromDB.map((status) => ({
      label: status._id as string,
      amount: status.amount as number,
    }));

    const shipped = {
      total: shippedTotal,
      delivered: delivered,
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

    type RevenueRegistry = Record<string, { month: string; revenue: number }[]>;

    const revenue = revenueFromDB.reduce((revenueInProgress, dbEntry) => {
      const year = dbEntry.year;
      revenueInProgress[year] ??= months.map((month) => ({
        month,
        revenue: 0,
      }));

      const monthIndex = dbEntry.month - 1;
      const yearArray = revenueInProgress[dbEntry.year];
      const monthObject = yearArray ? yearArray[monthIndex] : undefined;

      if (monthObject) {
        monthObject.revenue = dbEntry.revenue;
      }

      return revenueInProgress;
    }, {} as RevenueRegistry);

    const transactionStats = {
      totalOrders,
      statuses,
      shipped,
      revenue,
    };

    return transactionStats;
  }),
});
