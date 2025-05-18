import { z } from "zod";
import { PetSchema, type Pet } from "@/server/db/schema";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const petRouter = createTRPCRouter({
  getAllPets: protectedProcedure.query(async ({ ctx }) => {
    const pets = await ctx.db
      .collection<Pet>("pets")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return JSON.parse(JSON.stringify(pets)) as Pet[];
  }),
});
