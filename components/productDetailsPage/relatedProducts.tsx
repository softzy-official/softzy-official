"use client";

import React, { useEffect, useState } from "react";
import ProductCard, { Product } from "@/components/shopPage/productCard";
import { getRelatedProducts } from "@/app/actions/productActions";

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
}

const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    getRelatedProducts(currentProductId, category).then(setRelatedProducts);
  }, [currentProductId, category]);

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