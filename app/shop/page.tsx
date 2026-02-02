"use client";

import React, { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "@/components/shopPage/filterSidebar";
import ProductGrid from "@/components/shopPage/productGrid";
import ShopHeader from "@/components/shopPage/shopHeader";
import SortDropdown from "@/components/shopPage/sortDropdown";
import Pagination from "@/components/shopPage/pagination";
import { shopProducts } from "@/components/shopPage/products";

const ShopPageContent = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();

  // Filter products based on URL params
  const filteredProducts = useMemo(() => {
    let result = [...shopProducts];

    const searchQuery = searchParams.get("q")?.toLowerCase().trim();
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.shortDescription?.toLowerCase().includes(searchQuery) ||
          product.category?.toLowerCase().includes(searchQuery) ||
          product.brand?.toLowerCase().includes(searchQuery),
      );
    }

    // Category filter
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const categories = categoryParam.split(",");
      result = result.filter((product) => {
        const productCategory = product.category?.toLowerCase();
        return categories.some((cat) =>
          productCategory?.includes(cat.toLowerCase()),
        );
      });
    }

    // Collection filter
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      result = result.filter((product) => {
        const tags =
          product.tags?.map((t) => t.toLowerCase().replace(/\s+/g, "-")) || [];
        switch (filterParam) {
          case "best-sellers":
            return tags.includes("best-seller") || tags.includes("best-seller");
          case "new-arrivals":
            return tags.includes("new");
          case "trending":
            return tags.includes("trending");
          case "sale":
            return tags.includes("sale");
          case "featured":
            return tags.includes("featured");
          default:
            return true;
        }
      });
    }

    // Price filter
    const priceParam = searchParams.get("price");
    if (priceParam) {
      result = result.filter((product) => {
        const price = product.price;
        switch (priceParam) {
          case "0-500":
            return price < 500;
          case "500-1000":
            return price >= 500 && price < 1000;
          case "1000-2000":
            return price >= 1000 && price < 2000;
          case "2000-5000":
            return price >= 2000 && price < 5000;
          case "5000+":
            return price >= 5000;
          default:
            return true;
        }
      });
    }

    // Rating filter
    const ratingParam = searchParams.get("rating");
    if (ratingParam) {
      result = result.filter((product) => {
        switch (ratingParam) {
          case "4+":
            return product.rating >= 4;
          case "3+":
            return product.rating >= 3;
          case "2+":
            return product.rating >= 2;
          default:
            return true;
        }
      });
    }

    // Sorting
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      switch (sortParam) {
        case "newest":
          result = [...result].reverse();
          break;
        case "price-low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    return result;
  }, [searchParams]);

  const totalProducts = filteredProducts.length;

  // Pagination
  const productsPerPage = 9;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  return (
    <div className="min-h-screen">
      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Mobile Filter Sidebar - Only rendered on mobile */}
      <div className="lg:hidden">
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          isMobile
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
              <ShopHeader
                totalProducts={totalProducts}
                onFilterToggle={() => setIsFilterOpen(true)}
              />
              <div className="flex-shrink-0 self-start">
                <SortDropdown />
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={paginatedProducts} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
};

export default ShopPage;
