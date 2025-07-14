import { ObjectId } from "mongodb";
import { z } from "zod";

// ======================= User =======================

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

// ======================= Pet =======================

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

// ======================= Product =======================

export const ProductDbSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string(),
  categoryId: z.instanceof(ObjectId),
  subcategoryId: z.instanceof(ObjectId),
  price: z.number(),
  previousPrice: z.number(),
  stock: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  image: z.string(),
  imageKey: z.string(),
  sales: z.number(),
  views: z.number(),
  featured: z.boolean(),
});

export const ProductSchema = ProductDbSchema.extend({
  _id: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  subcategory: z.object({
    id: z.string(),
    name: z.string(),
  }),
}).omit({ categoryId: true, subcategoryId: true });

export type Product = z.infer<typeof ProductSchema>;
export type ProductDB = z.infer<typeof ProductDbSchema>;

// ======================= Categories =======================

export const CategoryDbSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string(),
});

export const CategorySchema = CategoryDbSchema.extend({
  _id: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;
export type CategoryDB = z.infer<typeof CategoryDbSchema>;

// ======================= Subcategories =======================

export const SubCategoryDbSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  categoryId: z.instanceof(ObjectId),
  name: z.string(),
});

export const SubCategorySchema = SubCategoryDbSchema.extend({
  _id: z.string(),
  categoryId: z.string(),
});

export type SubCategory = z.infer<typeof SubCategorySchema>;
export type SubCategoryDB = z.infer<typeof SubCategoryDbSchema>;
