"use client";

import React from "react";
import {

  Ruler,
  Sparkles,
  FileText,
  Check,
  Droplets,
} from "lucide-react";
import { Product } from "@/components/shopPage/productCard";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const hasDescription = !!product.description;
  const hasFeatures = product.features && product.features.length > 0;
  const hasSpecifications =
    (product.specifications && product.specifications.length > 0) ||
    product.sku ||
    product.weight ||
    product.dimensions;
  const hasCareInstructions =
    product.careInstructions && product.careInstructions.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Section Header */}
      {/* <div className="text-center mb-8">
        <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full poppins mb-3">
          Everything You Need to Know
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground poppins">
          Product Details
        </h2>
      </div> */}

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Description Card */}
        {hasDescription && (
          <div className="lg:col-span-2 bg-secondary/5 border border-secondary/20 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-secondary/10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground poppins">
                Description
              </h3>
            </div>
            <div className="p-5 sm:p-6">
              <div className="text-muted-foreground poppins">
                {product.description?.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0 leading-relaxed text-sm sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features Card */}
        {hasFeatures && (
          <div className="bg-muted/50 border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-border/50">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground poppins">
                Key Features
              </h3>
            </div>
            <div className="p-5 sm:p-6">
              <div className="space-y-3">
                {product.features?.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-secondary" />
                    </div>
                    <span className="text-sm sm:text-base text-foreground poppins leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Specifications Card */}
        {hasSpecifications && (
          <div className="bg-muted/50 border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-border/50">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground poppins">
                Specifications
              </h3>
            </div>
            <div className="p-5 sm:p-6">
              <div className="space-y-2.5">
                {product.specifications?.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-b-0"
                  >
                    <span className="text-sm text-muted-foreground poppins">
                      {spec.label}
                    </span>
                    <span className="text-sm font-medium text-foreground poppins">
                      {spec.value}
                    </span>
                  </div>
                ))}
                {product.material && (
                  <div className="flex items-center justify-between py-2.5 border-b border-border/30">
                    <span className="text-sm text-muted-foreground poppins">Material</span>
                    <span className="text-sm font-medium text-foreground poppins">
                      {product.material}
                    </span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex items-center justify-between py-2.5 border-b border-border/30">
                    <span className="text-sm text-muted-foreground poppins">SKU</span>
                    <span className="text-sm font-medium text-foreground poppins">
                      {product.sku}
                    </span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex items-center justify-between py-2.5 border-b border-border/30">
                    <span className="text-sm text-muted-foreground poppins">Weight</span>
                    <span className="text-sm font-medium text-foreground poppins">
                      {product.weight}
                    </span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex items-center justify-between py-2.5 border-b border-border/30">
                    <span className="text-sm text-muted-foreground poppins">Dimensions</span>
                    <span className="text-sm font-medium text-foreground poppins">
                      {product.dimensions}
                    </span>
                  </div>
                )}
                {product.brand && (
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-muted-foreground poppins">Brand</span>
                    <span className="text-sm font-medium text-foreground poppins">
                      {product.brand}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Care Instructions Card */}
        {hasCareInstructions && (
          <div className="bg-secondary/5 border border-secondary/20 rounded-2xl sm:rounded-3xl overflow-hidden hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-secondary/10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground poppins">
                Care Instructions
              </h3>
            </div>
            <div className="p-5 sm:p-6">
              <div className="space-y-3">
                {product.careInstructions?.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm sm:text-base text-foreground poppins leading-relaxed pt-0.5">
                      {instruction}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        

       
      </div>
    </div>
  );
};

export default ProductDetails;