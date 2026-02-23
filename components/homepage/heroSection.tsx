"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
    subtitle: "Say yes to be comfortable",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000&auto=format&fit=crop",
  },
];

const HeroSection = () => {
  return (
    <section className="w-full bg-white">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4800, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="overflow-hidden hero-swiper"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[360px] sm:h-[400px] lg:h-[480px] xl:h-[500px] overflow-hidden">

              {/* Cinematic Image Zoom */}
              <motion.div
                initial={{ scale: 1.05, opacity: 0.9 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/35" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.45)_80%)]" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 max-w-3xl">

                  <motion.h1
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="text-3xl min-[360px]:text-4xl sm:text-5xl md:text-4xl lg:text-6xl xl:text-7xl text-white font-medium playfair mb-3 sm:mb-4 leading-tight drop-shadow-md tracking-tight"
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className="text-sm sm:text-lg lg:text-xl text-white/90 poppins mb-6 sm:mb-8 tracking-wide inter font-light"
                  >
                    {slide.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className="flex justify-center"
                  >
                    <Link
                      href="/shop"
                      className="px-6 sm:px-8 py-2.5 sm:py-3 bg-secondary text-white text-sm sm:text-base font-medium rounded-full poppins shadow-md transition-all"
                    >
                      Shop Now
                    </Link>
                  </motion.div>

                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;