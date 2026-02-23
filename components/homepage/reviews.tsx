"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  place: string;
  avatar: string;
  review: string;
  type: "text" | "image" | "video";
  media?: string;
  rating?: number;
}

interface ReviewsSectionProps {
  badge?: string;
  title?: string;
  description?: string;
  reviews?: Review[];
}

export const defaultReviews: Review[] = [
  {
    id: "r1",
    name: "Priya Sharma",
    place: "Mumbai",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    review:
      "Absolutely loved the quality. The saree fabric feels premium and looks exactly like the photos.",
    type: "image",
    media:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
    rating: 5,
  },
  {
    id: "r2",
    name: "Rahul Verma",
    place: "Delhi",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    review:
      "Smooth checkout, fast delivery, and solid packaging. Overall a very reliable shopping experience.",
    type: "text",
    rating: 5,
  },
  {
    id: "r3",
    name: "Ananya Patel",
    place: "Bangalore",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    review:
      "The jewellery looks elegant and minimal. I’ve already worn it twice and got compliments.",
    type: "image",
    media:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
    rating: 5,
  },
  {
    id: "r4",
    name: "Vikram Singh",
    place: "Jaipur",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    review:
      "Bought this as a gift and it was totally worth it. Product finish and quality exceeded expectations.",
    type: "image",
    media:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80",
    rating: 5,
  },
  {
    id: "r5",
    name: "Meera Iyer",
    place: "Chennai",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    review:
      "Really impressed with the home decor collection. Simple designs but very classy.",
    type: "text",
    rating: 5,
  },
  {
    id: "r6",
    name: "Arjun Nair",
    place: "Kochi",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    review:
      "Ordered toys for my kids and they loved it. Delivery was faster than expected.",
    type: "image",
    media:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80",
    rating: 5,
  },
  {
    id: "r7",
    name: "Sneha Gupta",
    place: "Kolkata",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    review:
      "Fabric quality is excellent and stitching is neat. Feels comfortable even after long wear.",
    type: "image",
    media:
      "https://images.unsplash.com/photo-1638428299984-1a097835adb6?auto=format&fit=crop&w=900&q=80",
    rating: 5,
  },
  {
    id: "r8",
    name: "Karthik Reddy",
    place: "Hyderabad",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    review:
      "Customer support was responsive and helpful. Definitely ordering again.",
    type: "text",
    rating: 5,
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

// Unified Review Card Component
const ReviewCard = ({ review }: { review: Review }) => {
  const hasMedia = review.type === "image" || review.type === "video";

  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px] group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
        {/* Media Section */}
        <div className="relative h-[200px] overflow-hidden">
          {hasMedia ? (
            <>
              {review.type === "video" ? (
                <video
                  src={review.media}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image 
                  src={review.media!} 
                  alt={review.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary/20 via-secondary/10 to-accent/20 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/5 rounded-full blur-2xl"></div>
                <Quote className="w-20 h-20 text-secondary/30 relative" fill="currentColor" />
              </div>
            </div>
          )}
          
          {/* Floating Quote Badge */}
          {/* <div className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <Quote className="w-3.5 h-3.5 text-secondary" fill="currentColor" />
          </div> */}
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Stars Row */}
          <div className="flex items-center gap-0.5 mb-3">
            {[...Array(review.rating || 5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          {/* Review Text */}
          <p className="text-sm text-gray-700 poppins leading-relaxed mb-4 line-clamp-3">
            &ldquo;{review.review}&rdquo;
          </p>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-secondary/20 flex-shrink-0">
              <Image src={review.avatar} alt={review.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 poppins truncate">{review.name}</h4>
              <p className="text-xs text-gray-500 poppins">{review.place}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewsSection = ({
  badge = "Testimonials",
  title = "What Our Customers Say",
  description = "Real stories from real people who love shopping with us",
  reviews = defaultReviews,
}: ReviewsSectionProps) => {
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section id="reviews" className="w-full py-16 sm:py-20 bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
  variants={sectionTimeline}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.4 }}
  className="text-center mb-12 sm:mb-14"
>
  {/* Badge */}
  <motion.span
    variants={fadeUp}
    className="bg-white/20 text-white text-xs sm:text-sm font-medium poppins inline-block px-4 py-1.5 rounded-full inter uppercase tracking-[0.12em] mb-3"
  >
    {badge}
  </motion.span>

  {/* Title */}
  <motion.h2
    variants={headingContainer}
    className="text-white mb-3 text-3xl sm:text-4xl lg:text-5xl playfair"
  >
    <AnimatedText text={title} />
  </motion.h2>

  {/* Description */}
  <motion.p
    variants={fadeUp}
    className="text-sm sm:text-base text-white/70 poppins max-w-lg mx-auto"
  >
    {description}
  </motion.p>

  {/* Decorative Line */}
  <div className="flex items-center justify-center gap-2 mt-5">
    <span className="w-8 sm:w-12 h-0.5 bg-white/30 rounded-full"></span>
    <span className="w-2 h-2 bg-white rounded-full"></span>
    <span className="w-8 sm:w-12 h-0.5 bg-white/30 rounded-full"></span>
  </div>
</motion.div>
      </div>

      {/* Moving Reviews Container */}
      <div className="relative">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 lg:w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
        
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 lg:w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

        {/* Single Row - Left to Right */}
        <motion.div
          className="flex gap-5 sm:gap-6"
          animate={{ x: [0, -((300 + 24) * reviews.length)] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 50,
              ease: "linear",
            },
          }}
        >
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;