"use client";

import React from "react";
import Link from "next/link";

const TopBanner = () => {
  return (
    <div className="relative w-full overflow-hidden bg-banner-gradient">
      
      {/* soft overlay for depth */}
      <div className="absolute inset-0 bg-black/5" />

      <div className="relative py-2.5 sm:py-3">
        <div className="marquee-track">
          
          <div className="marquee-content">
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
          </div>

          {/* duplicate for TRUE infinite loop */}
          <div className="marquee-content">
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
          </div>

        </div>
      </div>
    </div>
  );
};

const MarqueeItem = () => (
  <span className="mx-10 flex items-center gap-2 text-xs sm:text-sm inter font-medium tracking-[0.12em] text-primary-foreground/95">
  <span className="opacity-90">
    Free Shipping on Orders Above Rs 1,499
  </span>

  <span className="opacity-60"> - </span>

  <Link
    href="/shop"
    className="underline underline-offset-4 decoration-primary-foreground/60 hover:decoration-primary-foreground"
  >
    Shop Now
  </Link>
</span>

);

export default TopBanner;
