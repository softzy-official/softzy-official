"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Toys",
    href: "/shop?category=toys",
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Clothing",
    href: "/shop?category=clothing",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Shoes",
    href: "/shop?category=shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Bags",
    href: "/shop?category=bags",
    image:
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Beauty",
    href: "/shop?category=beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Handloom",
    href: "/shop?category=handloom",
    image:
      "https://plus.unsplash.com/premium_photo-1674273913841-1468c9432368?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Accessories",
    href: "/shop?category=accessories",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Home Decor",
    href: "/shop?category=home-decor",
    image:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const CategoryWithImage = () => {
  return (
    <section className="w-full py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full poppins mb-3">
            Browse Collections
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground poppins mb-2 tracking-tight sm:tracking-normal">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground poppins max-w-xl mx-auto">
            Discover amazing products in every category
          </p>
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
            <span className="w-2 h-2 bg-secondary rounded-full"></span>
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative"
            >
              {/* Card */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/40 hover:border-secondary/60">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/20 transition-colors duration-500" />

                {/* Category Name */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-2">
                  <h3 className=" font-semibold text-white poppins group-hover:text-white transition-all sm:text-xl md:text-2xl">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryWithImage;