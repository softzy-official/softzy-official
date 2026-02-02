"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { Product } from "@/components/shopPage/productCard";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

    //  ADD TO CART LOGIC IS WRITTEN FOR FUTURE SCOPE
  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if product already exists in cart
    const existingIndex = existingCart.findIndex(
      (item: { id: string; size?: string }) =>
        item.id === product.id && item.size === selectedSize
    );

    if (existingIndex > -1) {
      // Update quantity
      existingCart[existingIndex].quantity += quantity;
    } else {
      // Add new item
      existingCart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        quantity: quantity,
      });
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Show confirmation
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.buyLink) {
      window.open(product.buyLink, "_blank");
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      

      

      {/* Name */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground poppins leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm sm:text-base font-medium text-foreground poppins">
          {product.rating}
        </span>
        <span className="text-sm text-muted-foreground poppins">
          ({product.reviews} reviews)
        </span>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-sm sm:text-base text-muted-foreground poppins leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-2xl sm:text-3xl font-bold text-foreground poppins">
          Rs. {product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-lg sm:text-xl text-muted-foreground line-through poppins">
              Rs. {product.originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded poppins">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      {/* {product.inStock !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              product.inStock ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span
            className={`text-sm font-medium poppins ${
              product.inStock ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.inStock
              ? `In Stock${product.stockCount ? ` (${product.stockCount} available)` : ""}`
              : "Out of Stock"}
          </span>
        </div>
      )} */}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground poppins">
            Sizes Available
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[48px] px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all poppins ${
                  selectedSize === size
                    ? "border-secondary bg-secondary text-white"
                    : "border-border hover:border-secondary/50 text-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color */}
      {product.color && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground poppins">Color:</span>
          <span className="text-sm text-muted-foreground poppins">{product.color}</span>
        </div>
      )}

      {/* Quantity */}
      {/* <div className="space-y-3">
        <label className="text-sm font-medium text-foreground poppins">Quantity</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-lg font-medium hover:bg-muted transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center text-lg font-medium poppins">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-lg font-medium hover:bg-muted transition-colors"
          >
            +
          </button>
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {/* <button
          onClick={handleAddToCart}
          disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-base font-medium transition-all poppins ${
            addedToCart
              ? "bg-green-500 text-white"
              : "bg-secondary text-white hover:bg-secondary/90"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {addedToCart ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button> */}

        {product.buyLink && (
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border-2 border-secondary hover:text-secondary hover:bg-background text-base font-medium  bg-secondary text-white transition-all poppins cursor-pointer"
          >
            Buy Now
          </button>
        )}
      </div>

    </div>
  );
};

export default ProductInfo;