"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const heroSlides = [
  {
    id: 1,
    title: "Everyday Luxury, Thoughtfully Curated",
    subtitle: "Fashion • Beauty • Lifestyle essentials you’ll love",
    image:
      "https://images.unsplash.com/photo-1628992304915-1f67982fd774?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Where Tradition Meets Modern Style",
    subtitle: "Handpicked designs crafted to stand out",
    image:
      "https://images.unsplash.com/photo-1760843415898-4ca8ee8b8e06?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Designed to Feel Special",
    subtitle: "From subtle elegance to bold statements",
    image:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Elevate Your Everyday Look",
    subtitle: "Style that moves with you",
    image:
      "https://images.unsplash.com/photo-1759840278478-826c0d0f110e?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Made to feel good, luxury that comforts",
    subtitle: "say yes to be comfortable ",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000&auto=format&fit=crop",
  },
];

const HeroSection = () => {
  return (
    <section className="w-full pb-8 sm:pb-12 bg-white">
      <div className="">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4800, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="overflow-hidden hero-swiper"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-[360px] sm:h-[400px] lg:h-[480px] xl:h-[500px]">

                {/* IMAGE */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/35" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.45)_80%)]" />

                {/* CONTENT */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4 max-w-3xl">

                    <h1 className="text-3xl min-[360px]:text-4xl sm:text-5xl  md:text-4xl lg:text-6xl xl:text-7xl  text-white font-medium playfair mb-3 sm:mb-4 leading-tight drop-shadow-md tracking-tight">
                      {slide.title}
                    </h1>

                    <p className="text-sm sm:text-lg lg:text-xl text-white/90 poppins mb-6 sm:mb-8 tracking-wide inter font-light opacity-90">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-col min-[460px]:flex-row justify-center gap-3 sm:gap-4">
                      <Link
                        href="/shop"
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-secondary text-white text-sm sm:text-base font-medium rounded-xl poppins hover:bg-secondary/90 shadow-md hover:shadow-lg transition-all"
                      >
                        Shop Now
                      </Link>

                      <Link
                        href="#categories"
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/90 backdrop-blur text-foreground text-sm sm:text-base font-semibold rounded-xl poppins hover:bg-white transition-all hidden"
                      >
                        Explore Categories
                      </Link>
                    </div>

                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSection;
