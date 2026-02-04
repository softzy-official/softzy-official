"use client";

import React from "react";
import { Sparkles, ShieldCheck, Heart, Star } from "lucide-react";

const DividerMarquee = () => {
  return (
    <div className="w-full overflow-hidden py-4 sm:py-5 bg-gradient-to-r from-secondary/5 via-accent/5 to-secondary/5 border-y border-border/50">
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
      <Sparkles className="w-3.5 h-3.5 text-secondary" />
      <span>Premium Quality</span>
    </span>
    <span className="w-1 h-1 rounded-full bg-secondary/40"></span>
    
    <span className="flex items-center gap-2">
      <Heart className="w-3.5 h-3.5 text-secondary fill-secondary/20" />
      <span>Crafted with Care</span>
    </span>
    <span className="w-1 h-1 rounded-full bg-secondary/40"></span>
    
    <span className="flex items-center gap-2">
      <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
      <span>Trusted by Thousands</span>
    </span>
    <span className="w-1 h-1 rounded-full bg-secondary/40"></span>
    
    <span className="flex items-center gap-2">
      <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
      <span>5-Star Rated</span>
    </span>
    <span className="w-1 h-1 rounded-full bg-secondary/40"></span>
  </span>
);

export default DividerMarquee;