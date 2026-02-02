"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import TopBanner from "./topBanner";

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border pb-1">
      <TopBanner/>
      <div className="mx-auto px-6 sm:px-10 md:px-16">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo2.png"
              alt="Softzy"
              width={80}
              height={40}
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 md:pl-20">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 font-medium rounded-full transition-colors
                  ${
                    isActive(link.href)
                      ? "bg-secondary text-secondary-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
              >
                {link.name}
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
                <MessageCircle className="w-4.5 h-4.5" />
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
                    <MessageCircle className="w-4.5 h-4.5" />
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
