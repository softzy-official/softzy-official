"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const TopBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-primary ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center py-2.5 sm:py-3 text-center">
          
          {/* Banner Text */}
          <p className="text-xs sm:text-sm poppins font-medium tracking-tight sm:tracking-wide">
            Free Shipping on Orders Above ₹999 —{" "}
            <Link
              href="/shop"
              className="hover:underline transition-all duration-300 underline-offset-4  ease-in"
            >
              Shop Now
            </Link>
          </p>

          {/* Close Button */}
          <button
            onClick={() => setVisible(false)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition hidden"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default TopBanner;
