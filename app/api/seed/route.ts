// app/api/seed/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { shopProducts } from "@/data/products";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Clear existing products so we don't accidentally create duplicates if we run this twice
    await Product.deleteMany({});

    // 2. Insert all products from the static JSON data
    const inserted = await Product.insertMany(shopProducts);

    return NextResponse.json({
      message:
        "Database seeded successfully! Your products are now in MongoDB. 🎉",
      count: inserted.length,
    });
  } catch (error) {
    // console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error },
      { status: 500 },
    );
  }
}
