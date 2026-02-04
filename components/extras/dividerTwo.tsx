"use client";

import React from "react";
import { Truck, RotateCcw, Shield, Headphones } from "lucide-react";

const DividerTwo = () => {
  return (
    <div className="w-full overflow-hidden py-5 sm:py-6 bg-gradient-to-r from-accent/5 via-secondary/5 to-accent/5 border-y border-border/50">
      <div className="divider-marquee-track">
        <div className="divider-marquee-content">
          <DividerText />
          <DividerText />
          <DividerText />
          <DividerText />
        </div>

        {/* duplicate for seamless infinite loop */}
        <div className="divider-marquee-content">
          <DividerText />
          <DividerText />
          <DividerText />
          <DividerText />
        </div>
      </div>
    </div>
  );
};

const DividerText = () => (
  <span className="mx-6 sm:mx-8 flex items-center gap-3 sm:gap-4 text-xs sm:text-sm inter font-medium tracking-[0.15em] text-foreground/70 uppercase">
    <span className="flex items-center gap-2">
      <Truck className="w-3.5 h-3.5 text-accent" />
      <span>Free Shipping</span>
    </span>
    <span className="w-1 h-1 rounded-full bg-accent/40"></span>
    
    <span className="flex items-center gap-2">
      <RotateCcw className="w-3.5 h-3.5 text-accent" />
      <span>Easy Returns</span>
    </span>
    <span className="w-1 h-1 rounded-full bg-accent/40"></span>
    
    <span className="flex items-center gap-2">
      <Shield className="w-3.5 h-3.5 text-accent" />
      <span>Secure Payment</span>
    </span>
    <span className="w-1 h-1 rounded-full bg-accent/40"></span>
    
    <span className="flex items-center gap-2">
      <Headphones className="w-3.5 h-3.5 text-accent" />
      <span>24/7 Support</span>
    </span>
    <span className="w-1 h-1 rounded-full bg-accent/40"></span>
  </span>
);

export default DividerTwo;