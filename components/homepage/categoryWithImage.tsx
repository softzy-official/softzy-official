"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Toys",
    href: "/shop?category=toys",
    image: "/toys.png",
  },
  {
    name: "Handbags",
    href: "/shop?category=bags",
    image: "/bags.png",
  },
  {
    name: "Clothing",
    href: "/shop?category=clothing",
    image: "/cloths.png",
  },
  {
    name: "Shoes",
    href: "/shop?category=shoes",
    image: "/shoes.png",
  },
];

/* ===== Section Timeline ===== */

const sectionTimeline = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

/* ===== Badge + Description ===== */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

/* ===== Curtain Reveal (Title Words) ===== */

const headingContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const wordReveal = {
  hidden: { y: "100%", rotateZ: 4 },
  show: {
    y: "0%",
    rotateZ: 0,
    transition: {
      type: "spring" as const,
      stiffness: 65,
      damping: 16,
      mass: 0.9,
    },
  },
};

const AnimatedText = ({ text }: { text: string }) => (
  <>
    {text.split(" ").map((word, i, arr) => (
      <React.Fragment key={i}>
        <span className="inline-block overflow-hidden pb-1 -mb-1">
          <motion.span
            variants={wordReveal}
            className="inline-block origin-top-left"
          >
            {word}
          </motion.span>
        </span>
        {i < arr.length - 1 && " "}
      </React.Fragment>
    ))}
  </>
);

/* ===== Grid Cards Animation ===== */

const gridContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardReveal = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.25,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const CategoryWithImage = () => {
  return (
    <section id="categories" className="w-full bg-muted/5 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <motion.div
          variants={sectionTimeline}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.span
            variants={fadeUp}
            className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary font-medium rounded-full inter uppercase tracking-[0.12em] text-[12px] mb-3"
          >
            Browse Collections
          </motion.span>

          {/* Title */}
          <motion.h2
            variants={headingContainer}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground playfair mb-3"
          >
            <AnimatedText text="Shop by Category" />
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base text-muted-foreground poppins max-w-lg mx-auto"
          >
            Discover amazing products in every category
          </motion.p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
            <span className="w-2 h-2 bg-secondary rounded-full"></span>
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={cardReveal}>
              <Link
                key={category.name}
                href={category.href}
                className="group relative"
              >
                {/* Card */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/40 hover:border-secondary/60">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Hover Effect */}
                  {/* <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/20 transition-colors duration-500" /> */}

                  {/* Category Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 pb-2">
                    <h3 className=" font-semibold text-white poppins group-hover:text-white transition-all sm:text-xl md:text-2xl">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryWithImage;
