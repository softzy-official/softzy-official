"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, X, SlidersHorizontal, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
  type: "checkbox" | "radio";
}

const filterGroups: FilterGroup[] = [
  {
    id: "category",
    title: "Categories",
    type: "checkbox",
    options: [
      { id: "clothing", label: "Clothing"},
      { id: "jewelry", label: "Jewelry"},
      { id: "home-decor", label: "Home Decor" },
      { id: "beauty", label: "Beauty"},
      { id: "accessories", label: "Accessories"},
      { id: "bags", label: "Bags"},
      { id: "footwear", label: "Footwear"},
    ],
  },
  {
    id: "filter",
    title: "Collection",
    type: "radio",
    options: [
      { id: "best-sellers", label: "Best Sellers" },
      { id: "new-arrivals", label: "New Arrivals" },
      { id: "trending", label: "Trending" },
      { id: "sale", label: "On Sale" },
      { id: "featured", label: "Featured" },
    ],
  },
  {
    id: "price",
    title: "Price Range",
    type: "radio",
    options: [
      { id: "0-500", label: "Under ₹500" },
      { id: "500-1000", label: "₹500 - ₹1,000" },
      { id: "1000-2000", label: "₹1,000 - ₹2,000" },
      { id: "2000-5000", label: "₹2,000 - ₹5,000" },
      { id: "5000+", label: "Above ₹5,000" },
    ],
  },
  {
    id: "rating",
    title: "Rating",
    type: "radio",
    options: [
      { id: "4+", label: "4★ & above" },
      { id: "3+", label: "3★ & above" },
      { id: "2+", label: "2★ & above" },
    ],
  },
];

interface FilterSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const FilterSidebar = ({ isOpen = false, onClose, isMobile = false }: FilterSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    filterGroups.map((g) => g.id)
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const isFirstRender = useRef(true);

  // Dynamic search - update URL when user types
  useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }

  const currentQ = searchParams.get("q") || "";

  if (currentQ === debouncedSearch.trim()) return;

  const params = new URLSearchParams(searchParams.toString());

  if (debouncedSearch.trim()) {
    params.set("q", debouncedSearch.trim());
  } else {
    params.delete("q");
  }

  params.delete("page");
  router.replace(`/shop?${params.toString()}`, { scroll: false });
}, [debouncedSearch]);

  // Sync search query with URL when URL changes externally
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== searchQuery && !searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const getSelectedValues = (groupId: string): string[] => {
    const value = searchParams.get(groupId);
    if (!value) return [];
    return value.split(",");
  };

  const handleFilterChange = (
    groupId: string,
    optionId: string,
    type: "checkbox" | "radio"
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = getSelectedValues(groupId);

    if (type === "radio") {
      if (currentValues.includes(optionId)) {
        params.delete(groupId);
      } else {
        params.set(groupId, optionId);
      }
    } else {
      if (currentValues.includes(optionId)) {
        const newValues = currentValues.filter((v) => v !== optionId);
        if (newValues.length > 0) {
          params.set(groupId, newValues.join(","));
        } else {
          params.delete(groupId);
        }
      } else {
        params.set(groupId, [...currentValues, optionId].join(","));
      }
    }

    params.delete("page");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const clearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    router.push("/shop", { scroll: false });
  };

  const hasActiveFilters = filterGroups.some(
    (group) => getSelectedValues(group.id).length > 0
  ) || searchParams.get("q");

  // Mobile Sidebar
  if (isMobile) {
    return (
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-[85%] max-w-[320px]
          bg-background
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          overflow-y-auto
          shadow-2xl
        `}
      >
        <SidebarContent
          filterGroups={filterGroups}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
          getSelectedValues={getSelectedValues}
          handleFilterChange={handleFilterChange}
          clearAllFilters={clearAllFilters}
          hasActiveFilters={!!hasActiveFilters}
          onClose={onClose}
          showCloseButton
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          hasSearchQuery={!!searchQuery}
        />
      </aside>
    );
  }

  // Desktop Sidebar
  return (
    <aside className="w-full bg-white border border-border/40 rounded-2xl overflow-hidden">
      <SidebarContent
        filterGroups={filterGroups}
        expandedGroups={expandedGroups}
        toggleGroup={toggleGroup}
        getSelectedValues={getSelectedValues}
        handleFilterChange={handleFilterChange}
        clearAllFilters={clearAllFilters}
        hasActiveFilters={!!hasActiveFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearSearch={clearSearch}
        hasSearchQuery={!!searchQuery}
      />
    </aside>
  );
};

interface SidebarContentProps {
  filterGroups: FilterGroup[];
  expandedGroups: string[];
  toggleGroup: (id: string) => void;
  getSelectedValues: (id: string) => string[];
  handleFilterChange: (groupId: string, optionId: string, type: "checkbox" | "radio") => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  hasSearchQuery: boolean;
}

const SidebarContent = ({
  filterGroups,
  expandedGroups,
  toggleGroup,
  getSelectedValues,
  handleFilterChange,
  clearAllFilters,
  hasActiveFilters,
  onClose,
  showCloseButton,
  searchQuery,
  setSearchQuery,
  clearSearch,
  hasSearchQuery,
}: SidebarContentProps) => {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 p-4 sm:p-5 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-secondary" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground poppins">
              Filters
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-secondary hover:text-secondary/80 poppins font-medium hover:underline"
              >
                Clear All
              </button>
            )}
            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Box - Dynamic Search */}
      <div className="p-4 sm:p-5 pb-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-2.5 bg-muted/50 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground poppins focus:outline-none focus:border-secondary/50 transition-colors"
          />
          {hasSearchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30 transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Groups */}
      <div className="p-4 sm:p-5 space-y-1">
        {filterGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.id);
          const selectedValues = getSelectedValues(group.id);

          return (
            <div
              key={group.id}
              className="border-b border-border/30 last:border-b-0"
            >
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between py-3.5 group"
              >
                <span className="text-sm font-medium text-foreground poppins group-hover:text-secondary transition-colors flex items-center gap-2">
                  {group.title}
                  {selectedValues.length > 0 && (
                    <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-medium rounded-full">
                      {selectedValues.length}
                    </span>
                  )}
                </span>
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground group-hover:text-secondary" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-secondary" />
                  )}
                </span>
              </button>

              {isExpanded && (
                <div className="pb-4 space-y-1">
                  {group.options.map((option) => {
                    const isSelected = selectedValues.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleFilterChange(group.id, option.id, group.type)}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
                          isSelected
                            ? "bg-secondary/10"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div
                          className={`
                            w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all
                            ${group.type === "radio" ? "rounded-full" : "rounded"}
                            ${
                              isSelected
                                ? "bg-secondary border-2 border-secondary"
                                : "border-2 border-border"
                            }
                          `}
                        >
                          {isSelected && (
                            <span
                              className={`bg-white ${
                                group.type === "radio" ? "w-1.5 h-1.5 rounded-full" : "w-2 h-2 rounded-sm"
                              }`}
                            />
                          )}
                        </div>
                        <span
                          className={`text-sm poppins flex-1 text-left ${
                            isSelected
                              ? "text-secondary font-medium"
                              : "text-foreground"
                          }`}
                        >
                          {option.label}
                        </span>
                        
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FilterSidebar;