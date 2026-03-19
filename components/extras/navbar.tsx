"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, User, LogOut, LayoutDashboard, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import TopBanner from "./topBanner";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const cartItems = useCart((state) => state.items);
  
  // Prevent hydration mismatch for the cart badge
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border pb-1">
      <TopBanner />
      <div className="mx-auto px-6 sm:px-10 md:px-16">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo + Quote */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link href="/">
              <Image src="/logo2.png" alt="Softzy" width={80} height={40} className="h-12 sm:h-14 w-auto"/>
            </Link>
            <div className="relative w-[170px] sm:w-[190px] md:w-[220px] h-[22px] mt-0.5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentQuote}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-0 text-[13px] sm:text-sm md:text-base font-bold text-foreground whitespace-nowrap nunito"
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
                className={`relative inter font-medium px-4 py-2 rounded-full transition-colors group ${
                  isActive(link.href) ? "bg-secondary text-secondary-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.name}
                {!isActive(link.href) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-[calc(100%-2rem)]"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Section: Auth & Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            
            {/* Shopping Cart Button */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-accent">
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Auth Profile Icon */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                      <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === "admin" && (
                    <DropdownMenuItem asChild>
                       <Link href="/admin" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm" className="hidden sm:flex rounded-full">
                <Link href="/auth/login">
                  <User className="h-4 w-4 mr-2" /> Login
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden max-lg:flex rounded-full hover:bg-accent">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 px-5 pt-6 bg-card">
                <div className="mt-6 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-3 rounded-full text-base font-medium poppins ${
                        isActive(link.href) ? "bg-secondary text-secondary-foreground" : "hover:bg-accent"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {!session?.user && (
                    <Link href="/auth/login" className="px-4 py-3 rounded-full text-base font-medium hover:bg-accent">
                      Login
                    </Link>
                  )}
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