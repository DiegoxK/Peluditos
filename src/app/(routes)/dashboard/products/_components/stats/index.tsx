"use client";

import { api } from "@/trpc/react";
import { CategoriesPie } from "./_components/categories-pie";
import { ConversionRate } from "./_components/conversion-rate";
import { ProductsOnDiscount } from "./_components/products-on-discount";
import { NewProductsAreaChart } from "./_components/new-products";

export default function ProductStats() {
  const [productStats] = api.products.getStats.useSuspenseQuery();

  // const productStats = {
  //   totalProducts: 50,
  //   totalDiscounts: 10,
  //   totalCategories: 5,
  //   categoryData: [
  //     { id: "1", name: "Electronics", amount: 120 },
  //     { id: "2", name: "Clothing", amount: 80 },
  //     { id: "3", name: "Home Appliances", amount: 60 },
  //     { id: "4", name: "Books", amount: 40 },
  //     { id: "5", name: "Toys", amount: 30 },
  //   ],
  //   topProduct: {
  //     name: "Papaya criolla",
  //     sales: 200,
  //     views: 300,
  //   },
  //   registry: {
  //     "2025": [
  //       { month: "January", products: 5 },
  //       { month: "February", products: 8 },
  //       { month: "March", products: 12 },
  //       { month: "April", products: 10 },
  //       { month: "May", products: 15 },
  //       { month: "June", products: 20 },
  //       { month: "July", products: 18 },
  //       { month: "August", products: 22 },
  //       { month: "September", products: 25 },
  //       { month: "October", products: 30 },
  //       { month: "November", products: 28 },
  //       { month: "December", products: 35 },
  //     ],
  //     "2024": [
  //       { month: "January", products: 3 },
  //       { month: "February", products: 6 },
  //       { month: "March", products: 9 },
  //       { month: "April", products: 7 },
  //       { month: "May", products: 11 },
  //       { month: "June", products: 14 },
  //       { month: "July", products: 16 },
  //       { month: "August", products: 19 },
  //       { month: "September", products: 21 },
  //       { month: "October", products: 24 },
  //       { month: "November", products: 26 },
  //       { month: "December", products: 29 },
  //     ],
  //   },
  // };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CategoriesPie
          total={productStats.totalCategories}
          categories={productStats.categoryData}
        />
        <ConversionRate topProduct={productStats.topProduct} />
        <ProductsOnDiscount
          total={productStats.totalProducts}
          discounts={productStats.totalDiscounts}
        />
      </div>
      <NewProductsAreaChart registry={productStats.registry} />
    </>
  );
}
