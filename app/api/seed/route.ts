// app/api/seed/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { shopProducts } from "@/data/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function findDuplicates(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) {
    const key = v.trim().toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([key]) => key);
}

export async function GET() {
  try {
    // Remove client-only `id` before writing docs to MongoDB
    const seedDocs = shopProducts.map((product) => {
      const doc = { ...product };
      delete (doc as { id?: string }).id;
      return doc;
    });

    const duplicateSlugs = findDuplicates(seedDocs.map((p) => p.slug || ""));
    const duplicateSkus = findDuplicates(seedDocs.map((p) => p.sku || ""));

    if (duplicateSlugs.length || duplicateSkus.length) {
      return NextResponse.json(
        {
          error: "Seed data contains duplicate unique fields",
          duplicateSlugs,
          duplicateSkus,
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // 1. Clear existing products so we don't accidentally create duplicates if we run this twice
    await Product.deleteMany({});

    // 2. Insert all products from the static JSON data
    const inserted = await Product.insertMany(seedDocs, { ordered: true });

    return NextResponse.json({
      message:
        "Database seeded successfully! Your products are now in MongoDB. 🎉",
      count: inserted.length,
    });
  } catch (error: unknown) {
    console.error("Seeding error:", error);

    const err = error as { message?: string; code?: number; name?: string };
    return NextResponse.json(
      {
        error: "Failed to seed database",
        details: err?.message || "Unknown error",
        code: err?.code,
        name: err?.name,
      },
      { status: 500 },
    );
  }
}
