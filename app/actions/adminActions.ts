"use server";

import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

import Razorpay from "razorpay";
import { revalidatePath } from "next/cache";
import { sendOrderNotification } from "@/lib/notifications";
import Product from "@/models/Product";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function getDashboardKPIs() {
  try {
    await connectToDatabase();

    // 1. High-Level Aggregations for Revenue & Orders
    const allOrders = await Order.find(
      {},
      "status totalAmount createdAt",
    ).lean();

    let totalRevenue = 0;
    let successfulRevenue = 0;
    let totalOrders = allOrders.length;
    let pendingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;

    // Monthly data for the chart (last 6 months logic could go here, but let's do a simple grouping)
    // For simplicity, we create a basic frequency map of recent orders for the graph
    const monthlyGraphData: Record<
      string,
      { name: string; income: number; orders: number }
    > = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    allOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      if (!monthlyGraphData[monthKey]) {
        monthlyGraphData[monthKey] = { name: monthKey, income: 0, orders: 0 };
      }

      monthlyGraphData[monthKey].orders += 1;

      if (order.status !== "cancelled") {
        totalRevenue += order.totalAmount;
      }

      if (order.status === "delivered" || order.status === "shipped") {
        successfulRevenue += order.totalAmount;
        completedOrders += 1;
        monthlyGraphData[monthKey].income += order.totalAmount;
      } else if (order.status === "cancelled" || order.status === "failed") {
        cancelledOrders += 1;
      } else {
        // pending, paid
        pendingOrders += 1;
      }
    });

    // 2. Total Customers
    const totalCustomers = await User.countDocuments();

    // 3. Product & Category Stats
    const totalProducts = await Product.countDocuments();
    const categoriesAggr = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const categoriesCount = categoriesAggr.length;

    // Convert chart Object into array and sort (very basic chronological sort)
    const graphArray = Object.values(monthlyGraphData).reverse().slice(0, 7); // Last 7 months that had activity

    return {
      success: true,
      data: {
        totalRevenue,
        successfulRevenue,
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalCustomers,
        totalProducts,
        categoriesCount,
        graphData: graphArray,
      },
    };
  } catch (error) {
    console.error("Failed to fetch Admin KPIs:", error);
    return {
      success: false,
      data: {
        totalRevenue: 0,
        successfulRevenue: 0,
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        categoriesCount: 0,
        graphData: [],
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

    // Use `populate` to ensure child user data (email, name) is returned
    // Cast it to `any` temporarily if TS complains about the Mongoose Document shape
    const updatedOrder: any = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    ).populate("user", "name email phone");

    if (updatedOrder?.user) {
      // ⚠️ IMPORTANT: Added 'await' so Next.js doesn't kill the promise
      await sendOrderNotification(updatedOrder.user, orderId, "status", status);
    }

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

    const updatedOrder: any = await Order.findByIdAndUpdate(
      orderId,
      { trackingId, status: "shipped" },
      { new: true },
    ).populate("user", "name email phone");

    if (updatedOrder?.user) {
      // ⚠️ IMPORTANT: Added 'await' here too
      await sendOrderNotification(
        updatedOrder.user,
        orderId,
        "tracking",
        trackingId,
      );
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update tracking:", error);
    return { success: false, error: "Failed to update tracking" };
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
          as: "userOrders",
        },
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
                    cond: { $ne: ["$$order.status", "cancelled"] }, // Exclude cancelled from total
                  },
                },
                as: "validOrder",
                in: "$$validOrder.totalAmount",
              },
            },
          },
        },
      },
      {
        $project: {
          userOrders: 0, // Remove heavy order array to save bandwidth
          password: 0, // Ensure passwords never leak if you implement them
        },
      },
      { $sort: { createdAt: -1 } },
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
