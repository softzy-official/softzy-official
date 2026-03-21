"use server";

import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getUserOrders() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    
    if (!session?.user?.id) throw new Error("Unauthorized");

    await connectToDatabase();
    
    // Fetch orders, sort by newest first
    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(orders)); // Serialize for the client
  } catch (error) {
    // console.error("getUserOrders ERROR:", error);
    return [];
  }
}

export async function getOrderById(orderId: string) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
       throw new Error("Unauthorized");
    }

    await connectToDatabase();
    
    // Try to find the exact order
    const order = await Order.findOne({ 
      _id: orderId, 
      user: session.user.id // Security limit
    }).lean();

    if (!order) {
       return null;
    }

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    // console.error("getOrderById ERROR:", error);
    return null;
  }
}