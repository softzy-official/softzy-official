"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { 
    name: "Toys", 
    href: "/shop?category=toys", 
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { 
    name: "Clothing", 
    href: "/shop?category=clothing", 
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { 
    name: "Shoes", 
    href: "/shop?category=shoes", 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { 
    name: "Bags", 
    href: "/shop?category=bags", 
    image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { 
    name: "Beauty", 
    href: "/shop?category=beauty", 
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { 
    name: "Handloom", 
    href: "/shop?category=handloom", 
    image: "https://plus.unsplash.com/premium_photo-1674273913841-1468c9432368?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { 
    name: "Accessories", 
    href: "/shop?category=accessories", 
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { 
    name: "Home Decor", 
    href: "/shop?category=home-decor", 
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
];

const CategoryWithImage = () => {
  return (
    <section className="w-full py-10 sm:py-14 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-xs sm:text-sm font-medium rounded-full poppins mb-3 sm:mb-4">
            Browse Collections
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground poppins mb-3">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground poppins max-w-md mx-auto">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 place-items-center">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center gap-3 sm:gap-y-4 group"
            >
              {/* Image Circle */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 rounded-full overflow-hidden bg-card border-[3px] border-border hover:border-secondary transition-all duration-300 shadow-md hover:shadow-xl">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Category Name */}
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-foreground/85 group-hover:text-secondary transition-colors poppins text-center transition-all duration-300">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryWithImage;