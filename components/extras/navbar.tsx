"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border py-0.5 sm:py-1.5">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo2.png"
              alt="Softzy"
              width={80}
              height={40}
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  relative px-4 py-2 font-medium rounded-full
                  transition-colors duration-200
                  ${
                    isActive(link.href)
                      ? "bg-secondary text-secondary-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }
                  after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2
                  after:h-0.5 after:bg-secondary after:rounded-full
                  after:transition-all after:duration-300 after:ease-out
                  ${isActive(link.href) ? "after:w-0" : "after:w-0 hover:after:w-3/4"}
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            
            {/* Search Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="rounded-full hover:bg-accent transition-colors"
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-accent transition-colors"
              asChild
            >
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground flex items-center justify-center">
                  0
                </span>
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full hover:bg-accent transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 px-5 pt-5 bg-card">
                <div className="mt-8 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`
                        px-4 py-3 text-base font-medium poppins rounded-full
                        transition-colors duration-200
                        ${
                          isActive(link.href)
                            ? "bg-secondary text-secondary-foreground"
                            : "text-foreground/70 hover:bg-accent hover:text-foreground"
                        }
                      `}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar (Shown when toggled) */}
        {isSearchOpen && (
          <div className="pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 w-full bg-muted border-border rounded-full poppins focus:bg-card"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;