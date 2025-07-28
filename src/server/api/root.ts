import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { petRouter } from "./routers/pets";
import { productRouter } from "./routers/products";
import { categoryRouter } from "./routers/categories";
import { subCategoryRouter } from "./routers/subcategories";
import { orderRouter } from "./routers/orders";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pets: petRouter,
  products: productRouter,
  categories: categoryRouter,
  orders: orderRouter,
  subCategories: subCategoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
