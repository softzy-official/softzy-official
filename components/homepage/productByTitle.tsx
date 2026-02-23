"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { shopProducts } from "@/data/products";

const titles = [
  { id: "best-sellers", title: "Best Sellers" },
  { id: "new-arrivals", title: "New Arrivals" },
  { id: "beauty-picks", title: "Beauty Picks" },
  { id: "bag-essentials", title: "Bag Essentials" },
];

const ProductByTitle = () => {
  const [activeTitle, setActiveTitle] = useState("best-sellers");
  const products = shopProducts.filter((product) => {
    if (activeTitle === "best-sellers")
      return product.tags?.includes("Best Seller");
    if (activeTitle === "new-arrivals") return product.tags?.includes("New");
    if (activeTitle === "beauty-picks") return product.category === "beauty";
    if (activeTitle === "bag-essentials") return product.category === "bags";
    return false;
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to start on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, []);

  return (
    <section className="w-full bg-muted py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-xs sm:text-sm font-medium rounded-full poppins mb-3 sm:mb-4">
            Curated Picks
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground poppins mb-3">
            Shop by Spotlight
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground poppins max-w-lg mx-auto">
            Tap a spotlight to see matching products
          </p>
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
            <span className="w-2 h-2 bg-secondary rounded-full"></span>
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10 sm:mb-12 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={scrollRef}
            className="flex sm:justify-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 p-1.5 bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-sm">
              {titles.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTitle(item.id)}
                  className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-semibold poppins rounded-xl transition-all duration-300 whitespace-nowrap ${
                    activeTitle === item.id
                      ? "bg-secondary text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-sm transition-colors duration-300 ${
                      activeTitle === item.id
                        ? "bg-white"
                        : "bg-muted-foreground/40"
                    }`}
                  />
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group bg-card rounded-xl overflow-hidden border border-border/40 hover:border-secondary/60 hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-secondary text-white text-xs font-medium rounded poppins">
                    Sale
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-secondary transition-colors poppins line-clamp-2 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-foreground poppins">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs sm:text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10 sm:mt-12">
          <Link
            href={`/shop?filter=${activeTitle}`}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 shadow-md hover:shadow-lg transition-all duration-300 poppins"
          >
            View All {titles.find((t) => t.id === activeTitle)?.title}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductByTitle;
