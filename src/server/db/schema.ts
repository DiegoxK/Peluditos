import { ObjectId } from "mongodb";
import { z } from "zod";

export const UserSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
  emailVerified: z.date().optional(),
});
