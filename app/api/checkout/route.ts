// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import Razorpay from "razorpay";
import connectToDatabase from "@/lib/db"; 

import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { shopProducts } from "@/data/products"; // Adjust path if needed
import Order from '@/models/Order';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & { user: { id: string } };
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Recalculate price and verify stock securely on the backend
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      // Find the real product from your data (temporary until we move it to MongoDB)
      const product = shopProducts.find((p) => p.slug === item.slug); 
      
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 404 });
      }
      
      if (!product.inStock || item.quantity > (product.stockCount ?? 0)) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      totalAmount += product.price * item.quantity;
      
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0], // Snagging the first image based on your data structure
      });
    }

    // Connect to your DB using your specific cached connection handler
    await connectToDatabase();

    // 2. Create Order in Razorpay
    const options = {
      amount: Math.round(totalAmount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}_${session.user.id.substring(0, 5)}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 3. Create a Pending Order in your MongoDB
    const newOrder = await Order.create({
      user: session.user.id,
      items: orderItems,
      totalAmount,
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: newOrder._id,
    });
  } catch (error) {
    // console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}