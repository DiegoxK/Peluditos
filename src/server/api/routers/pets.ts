import { z } from "zod";
import { PetSchema, type Pet, type PetDB } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ObjectId } from "mongodb";
import { utapi } from "@/server/uploadthing";
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

export const GetAllPetsInputSchema = z.object({
  pageIndex: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
  sorting: SortingStateSchema,
  globalFilter: z.string().optional(),
  columnFilters: ColumnFiltersStateSchema,
});

type SortablePetFields = keyof Pick<
  PetDB,
  "name" | "specie" | "breed" | "status" | "age" | "entryDate" | "createdAt"
>;

type MongoSortOptions = Partial<Record<SortablePetFields, 1 | -1>> &
  Record<string, 1 | -1>;

interface MongoQueryFilter {
  $or?: Array<
    Partial<
      Record<keyof Pick<PetDB, "name" | "specie" | "breed">, { $regex: RegExp }>
    >
  >;
  name?: { $regex: RegExp } | string;
  specie?: { $regex: RegExp } | string | { $in: string[] };
  breed?: { $regex: RegExp } | string;
  status?: string | { $in: string[] };

  [key: string]: unknown;
}

export const petRouter = createTRPCRouter({
  getAllPets: protectedProcedure
    .input(GetAllPetsInputSchema)
    .query(async ({ ctx, input }) => {
      const { pageIndex, pageSize, sorting, globalFilter, columnFilters } =
        input;

      const MONGODB_QUERY_FILTER_CONDITIONS: MongoQueryFilter = {};

      // Global Filter
      if (globalFilter && globalFilter.trim() !== "") {
        const gFilterRegex = new RegExp(globalFilter.trim(), "i");
        MONGODB_QUERY_FILTER_CONDITIONS.$or = [
          { name: { $regex: gFilterRegex } },
          { specie: { $regex: gFilterRegex } },
          { breed: { $regex: gFilterRegex } },
        ];
      }

      // Column Filters
      if (columnFilters?.length) {
        columnFilters.forEach((filter) => {
          if (filter.value !== undefined && filter.value !== null) {
            const filterKey = filter.id as keyof MongoQueryFilter;

            if (filter.id === "specie" || filter.id === "status") {
              if (Array.isArray(filter.value) && filter.value.length > 0) {
                MONGODB_QUERY_FILTER_CONDITIONS[filterKey] = {
                  $in: filter.value,
                };
              } else if (
                typeof filter.value === "string" &&
                filter.value.trim() !== ""
              ) {
                MONGODB_QUERY_FILTER_CONDITIONS[filterKey] = filter.value;
              }
            }
          }
        });
      }

      // Sorting (single-column)
      let MONGODB_SORT_OPTIONS: MongoSortOptions = { createdAt: -1 };

      if (sorting?.length && sorting[0]) {
        const { id, desc } = sorting[0];

        const validSortKeys: SortablePetFields[] = [
          "name",
          "specie",
          "breed",
          "status",
          "age",
          "entryDate",
          "createdAt",
        ];
        if (validSortKeys.includes(id as SortablePetFields)) {
          MONGODB_SORT_OPTIONS = { [id as SortablePetFields]: desc ? -1 : 1 };
        } else {
          console.warn(
            `Invalid sort key received: ${id}. Reverting to default sort.`,
          );
        }
      }

      // Execute queries
      const totalRowCount = await ctx.db
        .collection<PetDB>("pets")
        .countDocuments(
          MONGODB_QUERY_FILTER_CONDITIONS as Record<string, unknown>,
        );

      const petsData = await ctx.db
        .collection<PetDB>("pets")
        .find(MONGODB_QUERY_FILTER_CONDITIONS as Record<string, unknown>)
        .sort(MONGODB_SORT_OPTIONS)
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .toArray();

      const pets = JSON.parse(JSON.stringify(petsData)) as Pet[];

      return {
        data: pets,
        totalRowCount,
      };
    }),

  createPet: protectedProcedure
    .input(PetSchema.omit({ _id: true, createdAt: true, updatedAt: true }))
    .mutation(async ({ ctx, input }) => {
      const newPetData = {
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await ctx.db
        .collection<PetDB>("pets")
        .insertOne(newPetData);

      return {
        acknowledged: result.acknowledged,
        insertedId: result.insertedId.toHexString(),
      };
    }),

  updatePet: protectedProcedure
    .input(PetSchema.omit({ createdAt: true, updatedAt: true }))
    .mutation(async ({ ctx, input }) => {
      const { _id, ...updateData } = input;
      const objectId = new ObjectId(_id);

      const updatePayload: Partial<Omit<PetDB, "_id" | "createdAt">> & {
        updatedAt: string;
      } = {
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      delete (updatePayload as { _id?: unknown })._id;

      const previousPetDocument = await ctx.db
        .collection<PetDB>("pets")
        .findOneAndUpdate(
          { _id: objectId },
          { $set: updatePayload },
          { returnDocument: "before" },
        );

      if (!previousPetDocument) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pet not found for update.",
        });
      }

      // Image deletion logic
      const oldImageKey = previousPetDocument.imageKey;
      const newImage = input.image;
      const oldImage = previousPetDocument.image;

      if (oldImageKey && newImage !== oldImage) {
        try {
          await utapi.deleteFiles(oldImageKey);
          console.log("Old image deletion success:", oldImageKey);
        } catch (err) {
          console.error("Old image deletion failed:", err);
        }
      }
      return JSON.parse(JSON.stringify(previousPetDocument)) as Pet | null;
    }),

  deletePet: protectedProcedure
    .input(PetSchema.pick({ _id: true }))
    .mutation(async ({ ctx, input }) => {
      const { _id } = input;
      const objectId = new ObjectId(_id);

      const deletedPetDocument = await ctx.db
        .collection<PetDB>("pets")
        .findOneAndDelete({ _id: objectId });

      if (!deletedPetDocument) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pet not found for deletion.",
        });
      }

      if (deletedPetDocument.imageKey) {
        try {
          await utapi.deleteFiles(deletedPetDocument.imageKey);
          console.log("Image deletion success:", deletedPetDocument.imageKey);
        } catch (err) {
          console.error("Image deletion failed:", err);
        }
      }
      return JSON.parse(JSON.stringify(deletedPetDocument)) as Pet | null;
    }),
});
