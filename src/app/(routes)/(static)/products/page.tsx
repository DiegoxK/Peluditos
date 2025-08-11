import { api, HydrateClient } from "@/trpc/server";
import ProductsView from "./_components/products-view";

const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_PRODUCT_FILTERS = {
  categories: [],
  subcategories: [],
  sortBy: "newest",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  void api.products.getPublicProducts.prefetch({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    ...DEFAULT_PRODUCT_FILTERS,
  });

  await api.categories.getAll.prefetch();

  return (
    <>
      <div className="bg-primary">
        <div className="space-y-2 px-4 py-12 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight">Nuestra Tienda</h1>
          <p className="text-primary-foreground/80 text-lg">
            Encuentra todo lo que necesitas para tu mejor amigo
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <HydrateClient>
          <ProductsView />
        </HydrateClient>
      </div>
    </>
  );
}
