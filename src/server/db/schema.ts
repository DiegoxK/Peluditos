import { env } from "@/env";
import { ObjectId } from "mongodb";
import { z } from "zod";

// ======================= User =======================

export const UserDbSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum([env.ADMIN_ROLE, env.EDITOR_ROLE, env.READONLY]),
  image: z.string().optional(),
  emailVerified: z.date().optional(),
});

export const UserSession = UserDbSchema.extend({
  id: z.string(),
}).omit({
  _id: true,
});

export const UserSchema = UserDbSchema.extend({
  _id: z.string(),
  role: z.enum(["ADMIN", "EDITOR", "READONLY"]),
}).omit({
  emailVerified: true,
});

export type User = z.infer<typeof UserSchema>;
export type UserSession = z.infer<typeof UserSession>;
export type UserDB = z.infer<typeof UserDbSchema>;

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
  category: z.instanceof(ObjectId),
  subcategory: z.instanceof(ObjectId),
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
});

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

// ======================= Orders =========================

export const OrderProductSchema = z.object({
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
});

export const ShippingAddressSchema = z.object({
  city: z.string(),
  department: z.string(),
  neighborhood: z.string(),
  details: z.string(),
});

export const CustomerInfoSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: ShippingAddressSchema,
});

export const ShippingInfoSchema = z.object({
  company: z.string(),
  code: z.string(),
  estimatedDate: z.string(),
});

export const OrderDbSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  orderId: z.string(),
  customer: CustomerInfoSchema,
  products: z.array(OrderProductSchema),
  total: z.number(),
  paymentMethod: z.string(),
  paymentStatus: z.enum(["aprobado", "pendiente", "rechazado"]),
  orderStatus: z.enum(["enviado", "procesando", "entregado", "cancelado"]),
  shipping: ShippingInfoSchema,
  notes: z.string().optional(),
  createdAt: z.string(),
});

export const OrderSchema = OrderDbSchema.extend({
  _id: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderDB = z.infer<typeof OrderDbSchema>;
