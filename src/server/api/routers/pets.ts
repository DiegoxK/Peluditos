import { PetSchema, type Pet, type PetDB } from "@/server/db/schema";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { ObjectId } from "mongodb";

export const petRouter = createTRPCRouter({
  getAllPets: protectedProcedure.query(async ({ ctx }) => {
    const pets = await ctx.db
      .collection<PetDB>("pets")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return JSON.parse(JSON.stringify(pets)) as Pet[];
  }),
  createPet: protectedProcedure
    .input(PetSchema.omit({ _id: true, entryDate: true }))
    .mutation(async ({ ctx, input }) => {
      const newPet = {
        ...input,
        entryDate: new Date().toISOString(),
      };

      const result = await ctx.db.collection<PetDB>("pets").insertOne(newPet);

      return result;
    }),

  updatePet: protectedProcedure
    .input(PetSchema.omit({ entryDate: true }))
    .mutation(async ({ ctx, input }) => {
      const { _id, ...updateData } = input;

      const result = await ctx.db
        .collection<PetDB>("pets")
        .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });

      return result;
    }),
});
