import { z } from "zod";

import { UserSchema, type User, type UserDB } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ObjectId, type Filter } from "mongodb";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";

const SortingStateSchema = z
  .array(z.object({ id: z.string(), desc: z.boolean() }))
  .optional();

const FilterValueSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.null(),
  z.undefined(),
]);

const ColumnFilterSchema = z.object({
  id: z.string(),
  value: FilterValueSchema,
});

const ColumnFiltersStateSchema = z.array(ColumnFilterSchema).optional();

export const GetAllUsersInputSchema = z.object({
  pageIndex: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
  sorting: SortingStateSchema,
  globalFilter: z.string().optional(),
  columnFilters: ColumnFiltersStateSchema,
});

export const SortableUserFieldsSchema = z.enum(["name", "email", "role"]);
type SortableUserFields = z.infer<typeof SortableUserFieldsSchema>;
type MongoSortOptions = Partial<Record<SortableUserFields, 1 | -1>>;

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure
    .input(GetAllUsersInputSchema)
    .query(async ({ ctx, input }) => {
      const { pageIndex, pageSize, sorting, globalFilter, columnFilters } =
        input;

      const MONGODB_QUERY_FILTER_CONDITIONS: Filter<UserDB> = {};

      if (globalFilter && globalFilter.trim() !== "") {
        const gFilterRegex = new RegExp(globalFilter.trim(), "i");
        MONGODB_QUERY_FILTER_CONDITIONS.$or = [
          { name: { $regex: gFilterRegex } },
          { email: { $regex: gFilterRegex } },
        ];
      }

      if (columnFilters?.length) {
        columnFilters.forEach((filter) => {
          if (
            filter.value &&
            Array.isArray(filter.value) &&
            filter.value.length > 0
          ) {
            if (filter.id === "role") {
              MONGODB_QUERY_FILTER_CONDITIONS.role = { $in: filter.value };
            }
          }
        });
      }

      let MONGODB_SORT_OPTIONS: MongoSortOptions = {};
      if (sorting?.length && sorting[0]) {
        const { id, desc } = sorting[0];
        const parsedSortId = SortableUserFieldsSchema.safeParse(id);
        if (parsedSortId.success) {
          MONGODB_SORT_OPTIONS = { [parsedSortId.data]: desc ? -1 : 1 };
        }
      }

      const totalRowCount = await ctx.db
        .collection<UserDB>("users")
        .countDocuments(MONGODB_QUERY_FILTER_CONDITIONS);

      const usersData = await ctx.db
        .collection<UserDB>("users")
        .find(MONGODB_QUERY_FILTER_CONDITIONS)
        .sort(MONGODB_SORT_OPTIONS)
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .toArray();

      const usersForClient = JSON.parse(JSON.stringify(usersData)) as User[];

      return {
        data: usersForClient,
        totalRowCount,
      };
    }),

  createUser: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
        email: z.string().email("El correo electrónico no es válido."),
        role: UserSchema.shape.role,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== env.ADMIN_ROLE) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para crear usuarios.",
        });
      }

      const existingUser = await ctx.db
        .collection<UserDB>("users")
        .findOne({ email: input.email });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Un usuario con este correo electrónico ya existe.",
        });
      }

      const newUserDocument: Omit<UserDB, "_id"> = {
        ...input,
      };

      const result = await ctx.db
        .collection<UserDB>("users")
        .insertOne(newUserDocument as UserDB);

      return {
        success: true,
        insertedId: result.insertedId.toHexString(),
      };
    }),

  updateUserRole: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
        role: UserSchema.shape.role,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== env.ADMIN_ROLE) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para realizar esta acción.",
        });
      }
      if (ctx.session.user._id === input._id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No puedes cambiar tu propio rol.",
        });
      }

      const objectId = new ObjectId(input._id);
      const result = await ctx.db
        .collection<UserDB>("users")
        .updateOne({ _id: objectId }, { $set: { role: input.role } });

      if (result.matchedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuario no encontrado.",
        });
      }

      return { success: true };
    }),

  deleteUser: protectedProcedure
    .input(z.object({ _id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== env.ADMIN_ROLE) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para realizar esta acción.",
        });
      }
      if (ctx.session.user._id === input._id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No puedes eliminar tu propia cuenta.",
        });
      }

      const objectId = new ObjectId(input._id);
      const result = await ctx.db
        .collection<UserDB>("users")
        .deleteOne({ _id: objectId });

      if (result.deletedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuario no encontrado.",
        });
      }

      return { success: true };
    }),
});
