"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  badge?: string;
  title?: string;
  description?: string;
  faqs?: FAQ[];
}

const defaultFaqs: FAQ[] = [
  {
    id: "faq1",
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery. Free shipping on orders above ₹1499.",
  },
  {
    id: "faq2",
    question: "What is your return policy?",
    answer:
      "We offer hassle-free 7-day returns on all products. Items must be unused and in original packaging. Refunds are processed within 5-7 business days.",
  },
  {
    id: "faq3",
    question: "Are the products authentic?",
    answer:
      "Yes, all our products are 100% authentic and sourced directly from verified sellers. We guarantee quality and authenticity on every purchase.",
  },
  {
    id: "faq4",
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order from your account dashboard.",
  },
  {
    id: "faq5",
    question: "Do you offer Cash on Delivery?",
    answer:
      "Yes, we offer COD on orders up to ₹5,000. A small COD fee of ₹49 applies. Prepaid orders enjoy free shipping on orders above ₹1499.",
  },
  {
    id: "faq6",
    question: "How do I contact customer support?",
    answer:
      "You can reach us via WhatsApp, email, or call. Our support team is available Monday to Saturday, 10 AM to 7 PM. We respond within 24 hours.",
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

const FAQItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 sm:py-5 text-left group"
      >
        <span className="text-sm sm:text-base font-medium text-foreground inter pr-4 group-hover:text-secondary transition-colors">
          {faq.question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-secondary text-white"
              : "bg-muted text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary"
          }`}
        >
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-xs sm:text-sm text-muted-foreground inter font-normal leading-relaxed pb-4 sm:pb-5 pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = ({
  badge = "FAQs",
  title = "Our Shopping Policies",
  description = "Everything you need to know about shopping with us",
  faqs = defaultFaqs,
}: FAQSectionProps) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // Split FAQs into two columns
  const midpoint = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, midpoint);
  const rightFaqs = faqs.slice(midpoint);

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
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
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base text-muted-foreground poppins max-w-lg mx-auto"
          >
            {description}
          </motion.p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
            <span className="w-2 h-2 bg-secondary rounded-full"></span>
            <span className="w-8 sm:w-12 h-0.5 bg-border rounded-full"></span>
          </div>
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-7xl mx-auto">
          {/* MOBILE: Single Column */}
          <div className="lg:hidden bg-card rounded-2xl p-4 sm:p-6 border border-secondary/30">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}
          </div>

          {/* DESKTOP: Two Columns */}
          <div className="hidden lg:grid grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="bg-card rounded-xl p-6 border border-secondary/30">
              {leftFaqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => handleToggle(faq.id)}
                />
              ))}
            </div>

            {/* Right Column */}
            <div className="bg-card rounded-xl p-6 border border-secondary/30">
              {rightFaqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => handleToggle(faq.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
