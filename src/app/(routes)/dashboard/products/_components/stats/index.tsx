"use client";

import { api } from "@/trpc/react";
import { CategoriesPie } from "./_components/categories-pie";
import { ConversionRate } from "./_components/conversion-rate";
import { ProductsOnDiscount } from "./_components/products-on-discount";

export default function ProductStats() {
  const productStats = {
    totalProducts: 50,
    totalDiscounts: 10,
    totalCategories: 5,
    categoryData: [
      { id: "1", name: "Electronics", amount: 120 },
      { id: "2", name: "Clothing", amount: 80 },
      { id: "3", name: "Home Appliances", amount: 60 },
      { id: "4", name: "Books", amount: 40 },
      { id: "5", name: "Toys", amount: 30 },
    ],
    topProduct: {
      name: "Papaya criolla",
      sales: 200,
      views: 300,
    },
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
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
    </>
  );
}
