"use server";

import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

import Razorpay from "razorpay";
import { revalidatePath } from "next/cache";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function getDashboardKPIs() {
  try {
    await connectToDatabase();

    // 1. Total Orders
    const totalOrders = await Order.countDocuments();

    // 2. Total Customers
    const totalCustomers = await User.countDocuments();

    // 3. Total Revenue (sum of totalAmount where status is not cancelled)
    const revenueAggregation = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    // 4. Pending Despatch (usually 'paid' or 'processing' before shipment)
    const pendingDespatch = await Order.countDocuments({ status: "paid" });

    return {
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        pendingDespatch,
      },
    };
  } catch (error) {
    console.error("Failed to fetch Admin KPIs:", error);
    return {
      success: false,
      data: {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        pendingDespatch: 0,
      },
    };
  }
}

// 1. Fetch all orders with populated user info
export async function getAllOrdersAdmin() {
  try {
    await connectToDatabase();
    // Population pulls name & email from the User model
    const orders = await Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    // Map Mongoose documents to standard JS Objects to pass to Client Components securely
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Failed to fetch Admin Orders:", error);
    return [];
  }
}

// 2. Update Order Status
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await connectToDatabase();
    await Order.findByIdAndUpdate(orderId, { status });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

// 3. Update Order Tracking / AWB
export async function updateOrderTracking(orderId: string, trackingId: string) {
  try {
    await connectToDatabase();
    // Usually assigning tracking implies it's shipped
    await Order.findByIdAndUpdate(orderId, { trackingId, status: "shipped" });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update tracking:", error);
    return { success: false, error: "Failed to update tracking ID" };
  }
}

// 4. Fetch Deep Payment Metadata directly from Razorpay
export async function getRazorpayPaymentDetails(paymentId: string) {
  try {
    if (!paymentId)
      return { success: false, message: "No payment ID provided." };

    // Grabbing the pure payment profile from Razorpay Servers
    const payment = await razorpay.payments.fetch(paymentId);

    return {
      success: true,
      payment: {
        method: payment.method,
        contact: payment.contact,
        email: payment.email,
        card: payment.card_id ? "Card Used" : "Other Method",
        bank: payment.bank || "N/A",
        wallet: payment.wallet || "N/A",
      },
    };
  } catch (error) {
    console.error("Razorpay Fetch Error:", error);
    return { success: false, error: "Unable to verify with Razorpay" };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await connectToDatabase();
    await Order.findByIdAndDelete(orderId);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

// 6. Fetch all users with aggregated stats
export async function getAllUsersAdmin() {
  try {
    await connectToDatabase();
    
    // Advanced Aggregation: Attach orders to users and calculate their real lifetime value
    const users = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user",
          as: "userOrders"
        }
      },
      {
        $addFields: {
          totalOrders: { $size: "$userOrders" },
          totalSpent: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$userOrders",
                    as: "order",
                    cond: { $ne: ["$$order.status", "cancelled"] } // Exclude cancelled from total
                  }
                },
                as: "validOrder",
                in: "$$validOrder.totalAmount"
              }
            }
          }
        }
      },
      {
        $project: {
          userOrders: 0, // Remove heavy order array to save bandwidth
          password: 0    // Ensure passwords never leak if you implement them
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Failed to fetch Admin Users:", error);
    return [];
  }
}

// 7. Update User Profile Role
export async function updateUserRole(userId: string, targetRole: string) {
  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { role: targetRole });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: "Failed to update role" };
  }
}

// 8. Delete User
export async function deleteUserAdmin(userId: string) {
  try {
    await connectToDatabase();
    await User.findByIdAndDelete(userId);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}