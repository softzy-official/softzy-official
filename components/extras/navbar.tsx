"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import TopBanner from "./topBanner";
import { RiWhatsappLine } from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const quotes = [
    "Handcrafted with love",
    "Elegance in every detail",
    "Made for everyday beauty",
    "Style that feels personal",
  ];

  const [currentQuote, setCurrentQuote] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border pb-1">
      <TopBanner />
      <div className="mx-auto px-6 sm:px-10 md:px-16">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo + Quote */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo2.png"
                alt="Softzy"
                width={80}
                height={40}
                className="h-12 sm:h-14 w-auto"
              />
            </Link>

            {/* Fixed Width Quote Wrapper */}
            <div className="relative w-[170px] sm:w-[190px] md:w-[220px] h-[22px]  overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentQuote}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute left-0 top-0 text-[12px] sm:text-sm md:text-base font-medium text-foreground italic whitespace-nowrap playfair"
                >
                  “{quotes[currentQuote]}”
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 md:-ml-20">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative inter font-medium px-4 py-2 rounded-full transition-colors group
                  ${
                    isActive(link.href)
                      ? "bg-secondary text-secondary-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
              >
                {link.name}
                {!isActive(link.href) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-[calc(100%-2rem)]"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Social Icons */}
            <div className="hidden sm:flex items-center gap-1">
              <a
                href="https://instagram.com"
                target="_blank"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition"
              >
                <RiWhatsappLine className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full hover:bg-accent"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72 px-5 pt-6 bg-card">
                <div className="mt-6 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-3 rounded-full text-base font-medium poppins
                        ${
                          isActive(link.href)
                            ? "bg-secondary text-secondary-foreground"
                            : "hover:bg-accent"
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Social Icons */}
                <div className="mt-6 flex items-center gap-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition"
                  >
                    <Instagram className="w-4.5 h-4.5" />
                  </a>
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition"
                  >
                    <RiWhatsappLine className="w-4.5 h-4.5" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition"
                  >
                    <Facebook className="w-4.5 h-4.5" />
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
