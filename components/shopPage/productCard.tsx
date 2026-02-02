"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Eye } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviews: number;
  tags?: string[];
  category?: string;
  shortDescription?: string;
  description?: string;
  features?: string[];
  specifications?: { label: string; value: string }[];
  careInstructions?: string[];
  material?: string;
  color?: string;
  sizes?: string[];
  inStock?: boolean;
  stockCount?: number;
  sku?: string;
  brand?: string;
  weight?: string;
  dimensions?: string;
  warranty?: string;
  returnPolicy?: string;
  buyLink?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isMustTry?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isHovering, product.images.length]);

  useEffect(() => {
    if (!isHovering) {
      setCurrentImage(0);
    }
  }, [isHovering]);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group">
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-3 cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {product.images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={product.name}
            fill
            className={`object-cover object-top transition-all duration-700 ${
              currentImage === index
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          />
        ))}

        

      

        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {product.images.map((_, index) => (
              <span
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentImage === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm sm:text-base font-medium text-foreground poppins line-clamp-1 hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground poppins">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-base sm:text-lg font-bold text-foreground poppins">
            Rs. {product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-muted-foreground line-through poppins">
              Rs. {product.originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-secondary text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-secondary/90 active:scale-[0.98] transition-all poppins"
        >
          <Eye className="w-4 h-4" />
          View Product
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;