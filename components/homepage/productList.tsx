"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard, { Product } from "../shopPage/productCard";
import Link from "next/link";
import { getAllProducts } from "@/app/actions/productActions";

interface ProductListProps {
  badge: string;
  title: string;
  description: string;
  type: "featured" | "trending" | "mustTry";
  background?: string;
}

const listReveal = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardReveal = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.25,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const ProductList = ({
  badge,
  title,
  description,
  type,
  background = "white",
}: ProductListProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAllProducts().then((allProducts) => {
      if (isMounted) {
        const filtered = allProducts.filter((product) => {
          if (type === "featured") return product.isFeatured;
          if (type === "trending") return product.isTrending;
          if (type === "mustTry") return product.isMustTry;
          return false;
        });
        setFilteredProducts(filtered);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [type]);

  if (!isLoading && filteredProducts.length === 0) return null;

  return (
    <section className={`py-16 sm:py-24 bg-${background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide uppercase mb-4 poppins">
              {badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground playfair mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground poppins">
              {description}
            </p>
          </div>

          <Link
            href={`/shop?filter=${type}`}
            className="hidden sm:inline-flex items-center justify-center px-6 py-3 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white rounded-xl font-medium transition-all duration-300 poppins whitespace-nowrap"
          >
            View All Collection
          </Link>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
             <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={listReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={cardReveal}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 sm:hidden">
          <Link
            href={`/shop?filter=${type}`}
            className="flex items-center justify-center w-full px-6 py-3 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white rounded-xl font-medium transition-all duration-300 poppins"
          >
            View All Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductList;