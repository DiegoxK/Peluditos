import { ObjectId } from "mongodb";
import { z } from "zod";

export const UserSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
  emailVerified: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

export interface UserSession {
  id: string;
  email: string;
  image: string;
  name: string;
}

export const PetDbSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string(),
  specie: z.enum(["perro", "gato"]),
  breed: z.string().optional(),
  age: z.number(),
  status: z.enum(["adoptado", "disponible", "en tratamiento"]),
  image: z.string(),
  imageKey: z.string(),
  entryDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string(),
  gender: z.enum(["macho", "hembra"]),
  weight: z.number(),
  vaccinated: z.boolean(),
  sterilized: z.boolean(),
});
export const PetSchema = PetDbSchema.extend({
  _id: z.string(),
});

export type Pet = z.infer<typeof PetSchema>;
export type PetDB = z.infer<typeof PetDbSchema>;
