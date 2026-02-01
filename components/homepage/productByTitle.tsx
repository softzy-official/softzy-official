"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const titles = [
  { id: "best-sellers", title: "Best Sellers" },
  { id: "new-arrivals", title: "New Arrivals" },
  { id: "beauty-picks", title: "Beauty Picks" },
  { id: "bag-essentials", title: "Bag Essentials" },
];

const productsData: Record<string, Array<{
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  href: string;
}>> = {
  "best-sellers": [
    { id: "1", name: "Classic Tote Bag", price: 1299, originalPrice: 1599, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/1" },
    { id: "2", name: "Floral Summer Dress", price: 899, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=764&auto=format&fit=crop", href: "/product/2" },
    { id: "3", name: "Kids Play Set", price: 599, originalPrice: 799, image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1170&auto=format&fit=crop", href: "/product/3" },
    { id: "4", name: "Running Sneakers", price: 1999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop", href: "/product/4" },
  ],
  "new-arrivals": [
    { id: "5", name: "Handwoven Scarf", price: 499, image: "https://plus.unsplash.com/premium_photo-1674273913841-1468c9432368?q=80&w=687&auto=format&fit=crop", href: "/product/5" },
    { id: "6", name: "Gold Earrings Set", price: 799, originalPrice: 999, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1074&auto=format&fit=crop", href: "/product/6" },
    { id: "7", name: "Decorative Vase", price: 1199, image: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1032&auto=format&fit=crop", href: "/product/7" },
    { id: "8", name: "Leather Wallet", price: 699, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/8" },
  ],
  "beauty-picks": [
    { id: "9", name: "Makeup Palette", price: 1499, originalPrice: 1899, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop", href: "/product/9" },
    { id: "10", name: "Skincare Set", price: 2499, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop", href: "/product/10" },
    { id: "11", name: "Lipstick Collection", price: 899, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop", href: "/product/11" },
    { id: "12", name: "Perfume Gift Set", price: 1999, originalPrice: 2499, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop", href: "/product/12" },
  ],
  "bag-essentials": [
    { id: "13", name: "Crossbody Bag", price: 899, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/13" },
    { id: "14", name: "Backpack Pro", price: 1599, originalPrice: 1999, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/14" },
    { id: "15", name: "Clutch Purse", price: 699, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/15" },
    { id: "16", name: "Travel Duffle", price: 2299, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/16" },
  ],
};

const ProductByTitle = () => {
  const [activeTitle, setActiveTitle] = useState("best-sellers");
  const products = productsData[activeTitle];

  return (
    <section className="w-full bg-muted py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-10 md:px-16">
        
        {/* 4 Title Tabs */}
        {/* Title Tabs */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-xs sm:text-sm font-medium rounded-full poppins mb-3 sm:mb-4">
            Curated Picks
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground poppins mb-3">
            Shop by Spotlight
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground poppins max-w-md mx-auto">
            Tap a spotlight to see matching products
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
            <span className="w-2 h-2 bg-secondary rounded-full"></span>
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 pb-4 -mt-4">
            {titles.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTitle(item.id)}
                className={`inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-semibold poppins rounded-xl transition-all duration-300 border ${
                  activeTitle === item.id
                    ? "bg-card text-secondary border-secondary/70 shadow-[0_6px_18px_-10px_rgba(0,0,0,0.5)]"
                    : "bg-transparent text-muted-foreground border-transparent hover:bg-card hover:text-foreground"
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[4px] transition-colors duration-300 ${
                    activeTitle === item.id ? "bg-secondary" : "bg-muted-foreground/50"
                  }`}
                />
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pt-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-secondary/50 hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-secondary text-white text-xs font-medium rounded poppins">
                    Sale
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-secondary transition-colors poppins line-clamp-1 mb-1.5">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-foreground poppins">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="flex justify-center mt-10">
          <Link
            href={`/shop?filter=${activeTitle}`}
            className="px-8 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary/90 transition-colors poppins"
          >
            View All {titles.find(t => t.id === activeTitle)?.title}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductByTitle;