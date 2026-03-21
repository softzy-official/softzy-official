"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CheckoutButton from "@/components/checkoutButton"; 

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const cart = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  // Calculate pricing for logged-out preview scenario
  const subTotal = cart.getCartTotal();
  const shippingFee = subTotal > 0 && subTotal < 1400 ? 1 : 0;
  const grandTotal = subTotal + shippingFee;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-8">
        Your Shopping Cart
      </h1>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-24 w-24 bg-secondary rounded-full flex items-center justify-center mb-6 text-secondary-foreground">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Looks like you haven&apos;t added anything to your cart yet. Let&apos;s find some amazing products!
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id} className="overflow-hidden border-border/50 shadow-sm">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  {/* Product Image */}
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow flex flex-col justify-between h-full w-full space-y-4 sm:space-y-0">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        {/* Link securely mapped to slug */}
                        <Link href={`/product/${item.slug}`} className="font-semibold text-lg hover:underline decoration-1 underline-offset-4">
                          {item.name}
                        </Link>
                        <p className="text-sm font-medium text-primary mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          Status: <span className={(item.stockCount && item.quantity >= item.stockCount) ? "text-orange-500" : "text-green-600"}>
                            {(item.stockCount && item.quantity >= item.stockCount) ? `Max limit (${item.stockCount}) reached` : "In Stock"}
                          </span>
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-50 -mt-2 -mr-2"
                        onClick={() => cart.removeItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4 w-full justify-between sm:justify-start">
                      <div className="flex items-center border border-border rounded-full p-1 bg-background">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                          disabled={!!item.stockCount && item.quantity >= item.stockCount}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-bold sm:hidden">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Desktop Item Total */}
                  <div className="hidden sm:block text-right font-bold text-lg min-w-[100px]">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Summary Header */}
          <div className="lg:col-span-4 sticky top-24">
            <Card className="border-border/50 shadow-sm bg-card/50">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold font-serif mb-6">Order Summary</h2>
                
                {/* 
                   If user is authenticated, mount the strict, secure CheckoutButton!
                   If NOT authenticated, show a generic preview and force them to login first. 
                */}
                {session?.user ? (
                  <CheckoutButton />
                ) : (
                  <>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal ({cart.items.length} items)</span>
                        <span className="font-medium">₹{subTotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping Estimate</span>
                        <span className={`font-medium ${shippingFee === 0 ? "text-green-600" : ""}`}>
                          {shippingFee === 0 ? "Free" : `₹${shippingFee}`}
                        </span>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total (Please Log In)</span>
                        <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-8 rounded-full py-6 text-base font-semibold"
                      onClick={() => router.push("/auth/login?callbackUrl=/cart")}
                    >
                      Login to Checkout
                    </Button>
                  </>
                )}

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Taxes and additional shipping lines calculated securely.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}