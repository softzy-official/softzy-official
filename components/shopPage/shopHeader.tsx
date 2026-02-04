"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

interface ShopHeaderProps {
  totalProducts: number;
  onFilterToggle: () => void;
}

const ShopHeader = ({ totalProducts, onFilterToggle }: ShopHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getActiveFilters = () => {
    const filters: { key: string; value: string; label: string }[] = [];

    searchParams.forEach((value, key) => {
      if (key !== "sort" && key !== "page") {
        value.split(",").forEach((v) => {
          filters.push({
            key,
            value: v,
            label: v.replace(/-/g, " ").replace(/\+/g, " & above"),
          });
        });
      }
    });

    return filters;
  };

  const removeFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValue = params.get(key);
    if (currentValue) {
      const values = currentValue.split(",").filter((v) => v !== value);
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
      router.push(`/shop?${params.toString()}`, { scroll: false });
    }
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="space-y-4">
      {/* Top Row */}
      <div className="flex items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground poppins">
            Shop All
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground poppins mt-0.5">
            {/* Showing {totalProducts} product{totalProducts !== 1 ? "s" : ""} */}
            Discover thoughtfully curated products for you
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={onFilterToggle}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-sm font-medium hover:bg-secondary/90 transition-colors poppins"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilters.length > 0 && (
            <span className="w-5 h-5 bg-white text-secondary text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <button
              key={`${filter.key}-${filter.value}-${index}`}
              onClick={() => removeFilter(filter.key, filter.value)}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs sm:text-sm rounded-full poppins capitalize transition-colors"
            >
              {filter.label}
              <X className="w-3.5 h-3.5  transition-transform" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopHeader;