"use server";

import connectToDatabase from "@/lib/db";
import User, { ICartItem } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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