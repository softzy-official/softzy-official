"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Review {
  id: string;
  name: string;
  place: string;
  avatar: string;
  review: string;
  type: "text" | "image" | "video";
  media?: string;
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
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    review: "Absolutely love the quality! The handloom saree I bought is stunning.",
    type: "image",
    media: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "r2",
    name: "Rahul Verma",
    place: "Delhi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    review: "Amazing experience shopping here. Fast delivery and beautiful packaging!",
    type: "text",
  },
  {
    id: "r3",
    name: "Ananya Patel",
    place: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    review: "The jewelry collection is to die for! Got so many compliments.",
    type: "video",
    media: "https://www.pexels.com/download/video/7157410/",
  },
  {
    id: "r4",
    name: "Vikram Singh",
    place: "Jaipur",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    review: "Best online shopping experience ever. Perfect gift for my wife!",
    type: "image",
    media: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "r5",
    name: "Meera Iyer",
    place: "Chennai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    review: "I'm obsessed with their home decor! Every piece is unique.",
    type: "text",
  },
  {
    id: "r6",
    name: "Arjun Nair",
    place: "Kochi",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    review: "Ordered toys for my kids and they arrived super fast!",
    type: "video",
    media: "https://www.pexels.com/download/video/29645638/",
  },
  {
    id: "r7",
    name: "Sneha Gupta",
    place: "Kolkata",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    review: "Beautiful ethnic wear collection. Fabric quality exceeded expectations.",
    type: "image",
    media: "https://images.unsplash.com/photo-1638428299984-1a097835adb6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "r8",
    name: "Karthik Reddy",
    place: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    review: "Great customer service and amazing products. Highly recommend!",
    type: "text",
  },
];

// Video Card Component
const VideoCard = ({ review }: { review: Review }) => {
  return (
    <div className="flex-shrink-0 w-[240px] sm:w-[260px] bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="relative aspect-[3/4] bg-gray-100">
        <video
          src={review.media}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-white/50">
              <Image src={review.avatar} alt={review.name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white poppins">{review.name}</h4>
              <p className="text-[10px] text-white/70 poppins">{review.place}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Image Card Component
const ImageCard = ({ review }: { review: Review }) => {
  return (
    <div className="flex-shrink-0 w-[240px] sm:w-[260px] bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image src={review.media!} alt={review.name} fill className="object-cover" />
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-700 poppins leading-relaxed mb-2.5 line-clamp-2">
          {review.review}
        </p>
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-secondary/20">
            <Image src={review.avatar} alt={review.name} fill className="object-cover" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 poppins">{review.name}</h4>
            <p className="text-[10px] text-gray-500 poppins">{review.place}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Text Card Component
const TextCard = ({ review }: { review: Review }) => {
  return (
    <div className="flex-shrink-0 w-[240px] sm:w-[260px] bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-700 poppins leading-relaxed mb-3 line-clamp-4">
        {review.review}
      </p>
      <div className="flex items-center gap-2">
        <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-secondary/20">
          <Image src={review.avatar} alt={review.name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-900 poppins">{review.name}</h4>
          <p className="text-[10px] text-gray-500 poppins">{review.place}</p>
        </div>
      </div>
    </div>
  );
};

// Review Card Router
const ReviewCard = ({ review }: { review: Review }) => {
  switch (review.type) {
    case "video":
      return <VideoCard review={review} />;
    case "image":
      return <ImageCard review={review} />;
    default:
      return <TextCard review={review} />;
  }
};

const ReviewsSection = ({
  badge = "Testimonials",
  title = "What Our Customers Say",
  description = "Real stories from real people who love shopping with us",
  reviews = defaultReviews,
}: ReviewsSectionProps) => {
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs sm:text-sm font-medium rounded-full poppins mb-3 sm:mb-4">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white poppins mb-3">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-white/70 poppins max-w-lg mx-auto">
            {description}
          </p>
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
            <span className="w-8 sm:w-12 h-0.5 bg-white/30 rounded-full"></span>
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="w-8 sm:w-12 h-0.5 bg-white/30 rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Moving Reviews Container */}
      <div className="relative">
        {/* Left Fade - Softer */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
        
        {/* Right Fade - Softer */}
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

        {/* Row 1 - Left to Right */}
        <div className="mb-4 sm:mb-5">
          <motion.div
            className="flex gap-4 sm:gap-5"
            animate={{ x: [0, -264 * reviews.length] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {duplicatedReviews.map((review, index) => (
              <ReviewCard key={`row1-${review.id}-${index}`} review={review} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Right to Left */}
        <div>
          <motion.div
            className="flex gap-4 sm:gap-5"
            animate={{ x: [-264 * reviews.length, 0] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 45,
                ease: "linear",
              },
            }}
          >
            {[...duplicatedReviews].reverse().map((review, index) => (
              <ReviewCard key={`row2-${review.id}-${index}`} review={review} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;