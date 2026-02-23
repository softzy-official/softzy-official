"use client";

import React from "react";
import ProductCard, { Product } from "@/components/shopPage/productCard";
import { shopProducts } from "../../data/products";


interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
}

const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  // Get related products from same category
  const relatedProducts = shopProducts
    .filter(
      (product) =>
        product.id !== currentProductId &&
        product.category?.toLowerCase() === category?.toLowerCase()
    )
    .slice(0, 4);

  // If not enough products in same category, fill with other products
  if (relatedProducts.length < 4) {
    const otherProducts = shopProducts
      .filter(
        (product) =>
          product.id !== currentProductId &&
          !relatedProducts.find((rp) => rp.id === product.id)
      )
      .slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...otherProducts);
  }

  if (relatedProducts.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground inter mb-6 sm:mb-8">
        Customers also loved these
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;