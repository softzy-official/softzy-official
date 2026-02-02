import React from "react";
import { notFound } from "next/navigation";

import Link from "next/link";
import { shopProducts } from "@/components/shopPage/products";
import ImageGallery from "@/components/productDetailsPage/imageGallery";
import ProductInfo from "@/components/productDetailsPage/productInfo";
import ProductDetails from "@/components/productDetailsPage/productDetails";
import RelatedProducts from "@/components/productDetailsPage/relatedProducts";

interface ProductPageProps {
  params: Promise<{
    name: string;
  }>;
}

const SingleProductDetailsPage = async ({ params }: ProductPageProps) => {
  const { name } = await params;

  // Find the product by slug
  const product = shopProducts.find((p) => p.slug === name);

  // If product not found, show 404
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground poppins mb-6 sm:mb-8 overflow-x-auto">
          <Link href="/" className="hover:text-secondary transition-colors whitespace-nowrap">
            Home
          </Link>
          <span>/</span>
          <a href="/shop" className="hover:text-secondary transition-colors whitespace-nowrap">
            Shop
          </a>
          {product.category && (
            <>
              <span>/</span>
              <a
                href={`/shop?category=${product.category}`}
                className="hover:text-secondary transition-colors capitalize whitespace-nowrap"
              >
                {product.category.replace("-", " ")}
              </a>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Image Gallery */}
          <ImageGallery images={product.images} productName={product.name} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Product Details (Accordion) */}
        <div className="mb-12 sm:mb-16">
          <ProductDetails product={product} />
        </div>

        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </div>
    </div>
  );
};

export default SingleProductDetailsPage;