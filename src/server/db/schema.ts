import { ObjectId } from "mongodb";
import { z } from "zod";

export const UserSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
  emailVerified: z.date().optional(),
});

export const PetSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string(),
  specie: z.string(),
  breed: z.string(),
  age: z.number(),
  status: z.enum(["adoptado", "disponible", "en tratamiento"]),
  image: z.string(),
  entryDate: z.string(),
  description: z.string(),
  gender: z.enum(["Macho", "Hembra"]),
  weight: z.number(),
  vaccinated: z.boolean(),
  sterilized: z.boolean(),
});

export type Pet = z.infer<typeof PetSchema>;
