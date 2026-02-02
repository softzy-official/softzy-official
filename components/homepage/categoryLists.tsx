"use client";

import React from "react";
import Link from "next/link";
import { 
  Compass, 
  Baby, 
  Shirt, 
  Footprints, 
  ShoppingBag, 
  Sparkles, 
  Scissors, 
  Package 
} from "lucide-react";

const categories = [
  { name: "Explore", href: "/shop", icon: Compass },
  { name: "Toys", href: "/shop?category=toys", icon: Baby },
  { name: "Clothing", href: "/shop?category=clothing", icon: Shirt },
  { name: "Shoes", href: "/shop?category=shoes", icon: Footprints },
  { name: "Bags", href: "/shop?category=bags", icon: ShoppingBag },
  { name: "Beauty", href: "/shop?category=beauty", icon: Sparkles },
  { name: "Handloom", href: "/shop?category=handloom", icon: Scissors },
  { name: "Collections", href: "/shop", icon: Package },
];

const CategoryLists = () => {
  return (
    <section className="w-full bg-secondary border-b border-border/50 shadow-sm">
      <div className="container mx-auto">
        {/* Categories Container */}
        <div className="flex items-center justify-start lg:justify-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide py-2 sm:py-2.5 px-4 sm:px-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground bg-background/50 hover:bg-accent/50 rounded-md transition-all duration-300 poppins whitespace-nowrap hover:shadow-md"
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/60 transition-colors duration-300" />
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CategoryLists;