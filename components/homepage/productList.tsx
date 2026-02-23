"use client";

import React from "react";
import { motion } from "framer-motion";
import { shopProducts } from "../../data/products";
import ProductCard from "../shopPage/productCard";

type ProductSectionType = "featured" | "trending" | "mustTry";

interface ProductListProps {
  badge: string;
  title: string;
  description?: string;
  type: ProductSectionType;
  background?: string;
}

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

const ProductList = ({
  badge,
  title,
  description,
  type,
  background,
}: ProductListProps) => {
  const filteredProducts = shopProducts.filter((product) => {
    if (type === "featured") return product.isFeatured;
    if (type === "trending") return product.isTrending;
    if (type === "mustTry") return product.isMustTry;
    return false;
  });

  if (filteredProducts.length === 0) return null;

  return (
    <section className={`w-full py-16 ${background ? `bg-${background}` : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== Header ===== */}
        <motion.div
          variants={sectionTimeline}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center mb-10 sm:mb-12"
        >
          {/* Badge */}
          <motion.span
            variants={fadeUp}
            className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary font-medium rounded-full inter uppercase tracking-[0.12em] text-[12px] mb-3"
          >
            {badge}
          </motion.span>

          {/* Title */}
          <motion.h2
            variants={headingContainer}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground playfair mb-3"
          >
            <AnimatedText text={title} />
          </motion.h2>

          {/* Description */}
          {description && (
            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base text-muted-foreground poppins max-w-lg mx-auto"
            >
              {description}
            </motion.p>
          )}

          {/* Decorative Line */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-2 mt-4 sm:mt-5"
          >
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full" />
            <span className="w-2 h-2 bg-secondary rounded-full" />
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full" />
          </motion.div>
        </motion.div>

        {/* ===== Products Grid ===== */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={cardReveal}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default ProductList;