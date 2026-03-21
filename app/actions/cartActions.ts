"use server";

import connectToDatabase from "@/lib/db";
import User, { ICartItem } from "@/models/User";
import Product from "@/models/Product"; // Pull real Product model
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function syncCartToDatabase(cartItems: ICartItem[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role === "admin") {
      return { success: false, error: "Not logged in" };
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { cart: cartItems } },
      { new: true }
    );

    if (!user) return { success: false, error: "User not found" };

    return { success: true };
  } catch (error) {
    // console.error("Failed to sync cart:", error);
    return { success: false, error: "Internal server error" };
  }
}

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

    // 1. Load user's database cart
    for (const item of user.cart ?? []) {
      mergedMap.set(item.productId, { ...item });
    }

    // 2. Add guest items
    for (const item of guestCartItems ?? []) {
      const existing = mergedMap.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        mergedMap.set(item.productId, existing);
      } else {
        mergedMap.set(item.productId, { ...item });
      }
    }

    const mergedArray = Array.from(mergedMap.values());

    // 3. Verify stock logic dynamically using real MongoDB DB Products instead of static array
    const verifiedCart = [];
    for (const item of mergedArray) {
      // Find the actual product in DB using SLUG or ID
      const realProduct = await Product.findOne({
        $or: [{ _id: item.productId.length === 24 ? item.productId : null }, { slug: item.slug }]
      });

      if (realProduct) {
        const cap = realProduct.stockCount || 0;
        const safeQty = Math.max(0, Math.min(item.quantity, cap));

        if (safeQty > 0 && realProduct.inStock) {
          verifiedCart.push({ ...item, quantity: safeQty, productId: realProduct._id.toString() }); // Ensure clean IDs
        }
      }
    }

    // 4. Save validated cart
    user.cart = verifiedCart;
    await user.save();

    return { success: true, cart: verifiedCart };
  } catch (error) {
    // console.error("mergeGuestCartOnLogin failed:", error);
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
    // console.error("getDatabaseCart failed:", error);
    return { success: false, error: "Internal server error" };
  }
}