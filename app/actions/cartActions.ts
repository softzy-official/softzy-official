"use server";

import connectToDatabase from "@/lib/db";
import User, { ICartItem } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { shopProducts } from "@/data/products";

export async function syncCartToDatabase(cartItems: ICartItem[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role === "admin") {
      return { success: false, error: "Not logged in" };
    }

    await connectToDatabase();

    // Overwrite the DB Cart with the frontend Zustand Cart map
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { cart: cartItems } },
      { new: true }
    );

    if (!user) return { success: false, error: "User not found" };

    return { success: true };
  } catch (error) {
    console.error("Failed to sync cart:", error);
    return { success: false, error: "Internal server error" };
  }
}

const stockByProductId = new Map(
  shopProducts.map((p) => [p.id, p.stockCount ?? 0])
);

export async function mergeGuestCartOnLogin(guestCartItems: ICartItem[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role === "admin") {
      return { success: false, error: "Not logged in" };
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id);
    if (!user) return { success: false, error: "User not found" };

    const mergedMap = new Map<string, ICartItem>();

    for (const item of user.cart ?? []) {
      mergedMap.set(item.productId, { ...item });
    }

    for (const item of guestCartItems ?? []) {
      const existing = mergedMap.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        mergedMap.set(item.productId, existing);
      } else {
        mergedMap.set(item.productId, { ...item });
      }
    }

    const merged = Array.from(mergedMap.values()).map((item) => {
      const cap = stockByProductId.get(item.productId) ?? 0;
      const safeQty = Math.max(0, Math.min(item.quantity, cap));
      return { ...item, quantity: safeQty };
    }).filter((item) => item.quantity > 0);

    user.cart = merged;
    await user.save();

    return { success: true, cart: merged };
  } catch (error) {
    console.error("mergeGuestCartOnLogin failed:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function getDatabaseCart() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role === "admin") {
      return { success: false, error: "Not logged in" };
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id).lean();

    return { success: true, cart: user?.cart ?? [] };
  } catch (error) {
    console.error("getDatabaseCart failed:", error);
    return { success: false, error: "Internal server error" };
  }
}