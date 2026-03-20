"use server";

import connectToDatabase from "@/lib/db";
import ProductModel from "@/models/Product";
import { Product } from "@/components/shopPage/productCard";

// Helper function to safely map MongoDB lean documents to strictly typed Product objects
const mapToClientProduct = (doc: Record<string, unknown>): Product => {
  return {
    id: (doc._id as { toString: () => string }).toString(),
    name: doc.name as string,
    slug: doc.slug as string,
    price: doc.price as number,
    images: (doc.images as string[]) || [],
    rating: (doc.rating as number) || 0,
    reviews: (doc.reviews as number) || 0,
    inStock: doc.inStock !== false,
    stockCount: (doc.stockCount as number) || 0,
    sku: doc.sku as string,
    brand: doc.brand as string,
    
    // Optional properties safely mapped
    originalPrice: doc.originalPrice as number | undefined,
    weight: doc.weight as string | undefined,
    dimensions: doc.dimensions as string | undefined,
    warranty: doc.warranty as string | undefined,
    returnPolicy: doc.returnPolicy as string | undefined,
    isTrending: doc.isTrending as boolean | undefined,
    isFeatured: doc.isFeatured as boolean | undefined,
    isMustTry: doc.isMustTry as boolean | undefined,
    shortDescription: doc.shortDescription as string | undefined,
    description: doc.description as string | undefined,
    category: doc.category as string | undefined,
    tags: (doc.tags as string[]) || [],
    // categoryId: doc.categoryId as string | undefined,
    features: (doc.features as string[]) || [],
    careInstructions: (doc.careInstructions as string[]) || [],
    material: doc.material as string | undefined,
    color: doc.color as string | undefined,
    sizes: (doc.sizes as string[]) || []
  };
};

export async function getAllProducts(): Promise<Product[]> {
  try {
    await connectToDatabase();
    const products = await ProductModel.find({}).lean();
    return products.map(mapToClientProduct);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getRelatedProducts(currentProductId: string, category?: string): Promise<Product[]> {
  try {
    await connectToDatabase();
    
    // Build query to find products in same category but exclude the current one
    const query: Record<string, unknown> = { _id: { $ne: currentProductId } };
    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }

    const relatedProducts = await ProductModel.find(query).limit(4).lean();
    
    // If not enough related via category, fallback to just any other products
    if (relatedProducts.length < 4) {
      const fallbackProducts = await ProductModel.find({ _id: { $ne: currentProductId } })
        .limit(4 - relatedProducts.length)
        .lean();
      relatedProducts.push(...fallbackProducts);
    }

    // Deduplicate and map strictly
    const uniqueMap = new Map();
    relatedProducts.forEach((doc) => {
      const idStr = (doc._id as { toString: () => string }).toString();
      if (!uniqueMap.has(idStr)) {
        uniqueMap.set(idStr, mapToClientProduct(doc));
      }
    });

    return Array.from(uniqueMap.values()).slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await connectToDatabase();
    const doc = await ProductModel.findOne({ slug }).lean();
    if (!doc) return null;
    return mapToClientProduct(doc as Record<string, unknown>);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}