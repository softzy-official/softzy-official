"use client";

import React from "react";
import Link from "next/link";
import { exploreVideos } from "@/data/exploreVideos";

const ExplorePage = () => {
  return (
    <main className="min-h-screen bg-muted/5">
      {/* Hero Section */}
      <section className="relative py-10 bg-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full poppins mb-4 uppercase tracking-[0.12em]">
            Explore
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground playfair mb-6">
            Watch & Discover
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground poppins leading-relaxed max-w-2xl mx-auto">
            Discover product demos, unboxings, styling ideas, and
            behind-the-scenes moments.
          </p>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {exploreVideos.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-3xl overflow-hidden bg-black 
               shadow-lg hover:shadow-2xl  
               transition-all duration-500"
              >
                {/* Video - HEIGHT UNTOUCHED */}
                <div className="relative aspect-[4/5] sm:aspect-[10/16]  overflow-hidden">
                  <video
                    src={item.video}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />

                  {/* Stronger Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/30" />

                  {/* Pink Badge (Top Right) */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs bg-secondary text-white rounded-full poppins shadow-md">
                      {item.type}
                    </span>
                  </div>

                  {/* Bottom Overlay Info */}
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white playfair mb-2">
                      {item.title}
                    </h3>

                    <Link
                      href={item.productLink}
                      className="text-sm text-white/80 hover:text-white transition poppins hidden"
                    >
                      View Product →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExplorePage;
