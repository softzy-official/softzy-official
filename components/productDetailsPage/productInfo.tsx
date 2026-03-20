"use client";

import { useState } from "react";
import { Star, ShoppingCart, Check, Zap } from "lucide-react";
import { Product } from "@/components/shopPage/productCard";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Make sure to import toast

// ... (keep the imports and interface as they are)

const ProductInfo = ({ product }: { product: Product }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Track if they tried to submit without a size to highlight the box
  const [sizeError, setSizeError] = useState(false);

  const cart = useCart();
  const router = useRouter();

  const cartItem = cart.items.find((item) => item.id === product.id);
  const currentCartQty = cartItem ? cartItem.quantity : 0;
  const maxAllowedToAdd = Math.max(
    0,
    (product.stockCount || 0) - currentCartQty,
  );

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  // Helper validation function
  const validateBeforeAdding = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size before adding to cart.");
      setSizeError(true);
      return false;
    }
    setSizeError(false);
    return true;
  };

  const handleAddToCart = () => {
    if (!validateBeforeAdding()) return;

    cart.addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    setQuantity(1);
  };

   const handleBuyNow = () => {
    if (!validateBeforeAdding()) return;
    
    // Pass the standard 'product' and quantity '1' separately to match your useCart store!
    cart.addItem(product, 1); 
    router.push("/cart");
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ... (Keep Name, Rating, Description, Price, Stock Status code exactly as before) ... */}

      {/* Name */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground inter leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
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
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-sm sm:text-base text-muted-foreground poppins leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-2xl sm:text-3xl font-bold text-foreground inter">
          Rs.{" "}
          {product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-lg sm:text-xl text-muted-foreground opacity-80 line-through inter">
              Rs.{" "}
              {product.originalPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full inter">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Real Stock Status */}
      {product.inStock !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              product.inStock && product.stockCount && product.stockCount > 0
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <span
            className={`text-sm font-medium poppins ${
              product.inStock && product.stockCount && product.stockCount > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {product.inStock && product.stockCount && product.stockCount > 0
              ? `In Stock (${product.stockCount} available)`
              : "Out of Stock"}
          </span>
        </div>
      )}

      {/* Sizes Selection with Error Highlight */}
      {product.sizes && product.sizes.length > 0 && (
        <div
          className={`space-y-3 p-2 -mx-2 rounded-lg transition-colors ${sizeError ? "bg-red-50" : ""}`}
        >
          <label
            className={`text-sm font-medium poppins ${sizeError ? "text-red-600" : "text-foreground"}`}
          >
            Sizes Available {sizeError && "(Required)"}
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setSizeError(false); // Clear error when they click a size
                }}
                className={`min-w-12 px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all poppins ${
                  selectedSize === size
                    ? "border-secondary bg-secondary text-white"
                    : sizeError
                      ? "border-red-300 hover:border-red-400 text-foreground"
                      : "border-border hover:border-secondary/50 text-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ... (Keep Color and Quantity exactly as before) ... */}

      {/* Color */}
      {product.color && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground poppins">
            Color:
          </span>
          <span className="text-sm text-muted-foreground poppins">
            {product.color}
          </span>
        </div>
      )}

      {/* Quantity Selector */}
      {product.inStock && product.stockCount && product.stockCount > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground poppins">
            Quantity
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-lg font-medium hover:bg-muted transition-colors"
            >
              -
            </button>
            <span className="w-12 text-center text-lg font-medium poppins">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity(Math.min(maxAllowedToAdd, quantity + 1))
              }
              disabled={quantity >= maxAllowedToAdd}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-lg font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          {maxAllowedToAdd === 0 && (
            <p className="text-sm text-orange-500 poppins">
              You have all available stock in your cart.
            </p>
          )}
        </div>
      )}

      {/* Action Buttons - We ONLY disable if genuinely out of stock */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={
            !product.inStock ||
            !product.stockCount ||
            product.stockCount === 0 ||
            maxAllowedToAdd === 0
          }
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-base font-medium transition-all poppins ${
            addedToCart
              ? "bg-green-500 text-white"
              : "bg-secondary text-white hover:bg-secondary/90"
          } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
        >
          {addedToCart ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              {!product.inStock ||
              !product.stockCount ||
              product.stockCount === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={
            !product.inStock ||
            !product.stockCount ||
            product.stockCount === 0 ||
            maxAllowedToAdd === 0
          }
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border-2 border-secondary hover:text-secondary hover:bg-background text-base font-medium  bg-secondary text-white transition-all poppins cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-5 h-5" />
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
