"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  href: string;
}

interface ProductListTwoProps {
  badge?: string;
  title?: string;
  description?: string;
  products?: Product[];
}

const defaultProducts: Product[] = [
  {
    id: "f1",
    name: "Premium Leather Handbag",
    price: 2499,
    originalPrice: 3299,
    image:
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop",
    href: "/product/f1",
  },
  {
    id: "f2",
    name: "Elegant Summer Dress",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=764&auto=format&fit=crop",
    href: "/product/f2",
  },
  {
    id: "f3",
    name: "Kids Educational Toys Set",
    price: 899,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1170&auto=format&fit=crop",
    href: "/product/f3",
  },
  {
    id: "f4",
    name: "Sport Running Shoes",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop",
    href: "/product/f4",
  },
  {
    id: "f5",
    name: "Handcrafted Silk Scarf",
    price: 799,
    originalPrice: 999,
    image:
      "https://plus.unsplash.com/premium_photo-1674273913841-1468c9432368?q=80&w=687&auto=format&fit=crop",
    href: "/product/f5",
  },
  {
    id: "f6",
    name: "Gold Plated Jewelry Set",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1074&auto=format&fit=crop",
    href: "/product/f6",
  },
  {
    id: "f7",
    name: "Modern Home Decor Vase",
    price: 1199,
    originalPrice: 1499,
    image:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1032&auto=format&fit=crop",
    href: "/product/f7",
  },
  {
    id: "f8",
    name: "Professional Makeup Kit",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop",
    href: "/product/f8",
  },
];

const ProductListTwo = ({
  badge,
  title,
  description,
  products = defaultProducts,
}: ProductListTwoProps) => {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-xs sm:text-sm font-medium rounded-full poppins mb-3 sm:mb-4">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground poppins mb-3">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground poppins max-w-lg mx-auto">
            {description}
          </p>
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
            <span className="w-2 h-2 bg-secondary rounded-full"></span>
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group bg-card rounded-xl overflow-hidden border border-border/40 hover:border-secondary/60 hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                <Image
                  src={product.image}
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
      </div>
    </section>
  );
};

export default ProductListTwo;
