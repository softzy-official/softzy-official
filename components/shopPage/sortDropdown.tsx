"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";

const sortOptions = [
  { id: "relevance", label: "Relevance" },
  { id: "newest", label: "Newest First" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
];

const SortDropdown = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSort = searchParams.get("sort") || "relevance";
  const currentLabel = sortOptions.find((o) => o.id === currentSort)?.label || "Relevance";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (sortId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortId === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", sortId);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-card border border-border/60 rounded-xl text-xs sm:text-sm font-medium text-foreground hover:border-secondary/50 transition-colors poppins"
      >
        <span className="text-muted-foreground hidden sm:inline">Sort by:</span>
        <span>{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-card border border-border/60 rounded-xl shadow-lg overflow-hidden z-50">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSort(option.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm poppins transition-colors ${
                currentSort === option.id
                  ? "bg-secondary/10 text-secondary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {option.label}
              {currentSort === option.id && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;