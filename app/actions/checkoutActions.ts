"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { getServerSession, Session } from "next-auth";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User"; // IMPORTANT: Import User!
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface CartItem {
  slug: string;
  name: string;
  quantity: number;
}

interface SessionUser extends Session {
  user: {
    id: string;
    email?: string;
    name?: string;
  };
}

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createCheckoutOrder(items: CartItem[]) {
  try {
    const session = (await getServerSession(authOptions)) as SessionUser | null;
    if (!session?.user?.id) throw new Error("Unauthorized! Please login.");
    if (!items || items.length === 0) throw new Error("Cart is empty");

    await connectToDatabase();

    // 🔴 STRICT CHECK: Verify Address & Phone Number Exist
    const dbUser = await User.findById(session.user.id);
    if (!dbUser) throw new Error("User not found in database.");

    if (!dbUser.phone || !dbUser.address || !dbUser.address.street || !dbUser.address.city || !dbUser.address.state || !dbUser.address.zip) {
       return { 
         success: false, 
         error: "PROFILE_INCOMPLETE", // We will catch this exact string on the frontend
         message: "Please complete your profile (Phone & Address) before checking out." 
       };
    }

    // 1. Calculate price securely by pulling real prices from MongoDB
    let subTotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Find the real product in the database by slug!
      const product = await Product.findOne({ slug: item.slug });
      
      if (!product) throw new Error(`Product not found: ${item.name}`);
      if (!product.inStock || item.quantity > product.stockCount) {
        throw new Error(`Insufficient stock for ${product.name}. Only ${product.stockCount} left.`);
      }

      subTotal += product.price * item.quantity;
      
      orderItems.push({
        // 🔴 FIX: Storing the EXACT secure MongoDB _id so stock reduction won't fail
        productId: product._id.toString(), 
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || "", 
      });
    }

    // 2. Shipping Logic: Under ₹1400 gets ₹149 shipping
    const shippingFee = subTotal < 1400 ? 149 : 0;
    const totalAmount = subTotal + shippingFee;

    // 3. Create Order in Razorpay
    const options = {
      amount: Math.round(totalAmount * 100), 
      currency: "INR",
      receipt: `receipt_${Date.now()}_${session.user.id.substring(0, 5)}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 4. Create a Pending Order in standard MongoDB, saving the formatted address string
    const newOrder = await Order.create({
      user: session.user.id,
      items: orderItems,
      totalAmount,
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
      shippingAddress: `${dbUser.address.street}, ${dbUser.address.city}, ${dbUser.address.state}, ${dbUser.address.zip} - Phone: ${dbUser.phone}`
    });

    return {
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: newOrder._id.toString(),
      shippingFee,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Checkout Create Error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function verifyPaymentAndCompleteOrder(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  dbOrderId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await connectToDatabase();

    // 1. Verify Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      throw new Error("Invalid payment signature");
    }

    // 2. Signature match! Update Order to "paid"
    const order = await Order.findByIdAndUpdate(
      dbOrderId,
      {
        status: "paid",
        razorpayPaymentId,
        razorpaySignature,
      },
      { new: true } // Returns the updated document
    );

    if (!order) throw new Error("Order not found in database");

    // 3. 🔴 FIX: Deduct stock robustly. Since productId is perfectly mapped, it will work.
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockCount: -item.quantity },
      });
    }

    // 4. Optionally: Push this order ID into the User's "orders" array 
    await User.findByIdAndUpdate(order.user, {
      $push: { orders: order._id }
    });

    return { success: true, message: "Payment verified successfully" };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Payment Verification Error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}