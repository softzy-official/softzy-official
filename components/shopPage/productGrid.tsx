import React from "react";
import ProductCard, { Product } from "./productCard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] rounded-2xl bg-gray-200 mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
              <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
              <div className="h-5 bg-gray-200 rounded-lg w-1/3" />
              <div className="h-10 bg-gray-200 rounded-xl w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 sm:py-28">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-secondary/10 flex items-center justify-center mb-5">
          <span className="text-4xl sm:text-5xl">🛍️</span>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground poppins mb-2">
          No products found
        </h3>
        <p className="text-sm text-muted-foreground poppins text-center max-w-sm px-4">
          Try adjusting your filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 bg-muted/5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;