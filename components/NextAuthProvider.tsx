"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { mergeGuestCartOnLogin } from "@/app/actions/cartActions";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

function CartMergeBridge() {
  const { status, data: session } = useSession(); // Extract data: session
  const mergedOnceRef = useRef(false);
  const items = useCart((s) => s.items);
  const hydrateFromServerCart = useCart((s) => s.hydrateFromServerCart);

  useEffect(() => {
    const run = async () => {
      // Add the early return condition for the admin role
      if (status !== "authenticated" || session?.user?.role === "admin" || mergedOnceRef.current) return;
      mergedOnceRef.current = true;

      const guestCart = items.map((i) => ({
        productId: i.id,
        name: i.name,
        slug: i.slug,
        price: i.price,
        image: i.images?.[0] || "",
        quantity: i.quantity,
      }));

      const res = await mergeGuestCartOnLogin(guestCart);
      if (!res.success) {
        toast.error("Could not merge cart from server.");
        return;
      }

      const hydrated = (res.cart ?? []).map((c) => ({
        id: c.productId,
        name: c.name,
        slug: c.slug,
        price: c.price,
        images: [c.image],
        rating: 0,
        quantity: c.quantity,
        inStock: true,
        stockCount: 999,
      }));

      hydrateFromServerCart(hydrated);
    };

    run();
  }, [status, session, items, hydrateFromServerCart]);

  return null;
}

export const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <CartMergeBridge />
      {children}
    </SessionProvider>
  );
};