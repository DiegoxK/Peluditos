import { PetSchema, type Pet, type PetDB } from "@/server/db/schema";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { ObjectId } from "mongodb";
import { utapi } from "@/server/uploadthing";

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
    .input(PetSchema.omit({ _id: true, createdAt: true, updatedAt: true }))
    .mutation(async ({ ctx, input }) => {
      const newPet = {
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await ctx.db.collection<PetDB>("pets").insertOne(newPet);

      return result;
    }),

  updatePet: protectedProcedure
    .input(PetSchema.omit({ createdAt: true, updatedAt: true }))
    .mutation(async ({ ctx, input }) => {
      const { _id, ...updateData } = input;

      const previousData = await ctx.db
        .collection<PetDB>("pets")
        .findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $set: { ...updateData, updatedAt: new Date().toISOString() } },
          { returnDocument: "before" },
        );

      const isSameImage = previousData?.image === input.image;

      if (previousData?.imageKey && !isSameImage) {
        void utapi
          .deleteFiles(previousData.imageKey)
          .then((data) => console.log("Deletion success:", data.success))
          .catch((err) => console.error("Image deletion failed:", err));
      }

      return previousData;
    }),
});
