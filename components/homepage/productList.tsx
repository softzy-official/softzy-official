"use client";

import React from "react";
import { shopProducts } from "../shopPage/products";
import ProductCard from "../shopPage/productCard";

type ProductSectionType = "featured" | "trending" | "mustTry";

interface ProductListProps {
  badge: string;
  title: string;
  description?: string;
  type: ProductSectionType;
  background?: "muted";
}

const ProductList = ({
  badge,
  title,
  description,
  type,
  background,
}: ProductListProps) => {
  const filteredProducts = shopProducts.filter((product) => {
    if (type === "featured") return product.isFeatured;
    if (type === "trending") return product.isTrending;
    if (type === "mustTry") return product.isMustTry;
    return false;
  });

  if (filteredProducts.length === 0) return null;

  return (
    <section
      className={`w-full py-16  ${
        background === "muted" ? "bg-muted" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-xs sm:text-sm font-medium rounded-full poppins mb-3 sm:mb-4">
            {badge}
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground poppins mb-3">
            {title}
          </h2>

          {description && (
            <p className="text-sm sm:text-base text-muted-foreground poppins max-w-lg mx-auto">
              {description}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full" />
            <span className="w-2 h-2 bg-secondary rounded-full" />
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full" />
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductList;
