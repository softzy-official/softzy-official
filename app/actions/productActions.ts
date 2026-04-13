"use server";

import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import ProductModel from "@/models/Product";
import { Product } from "@/components/shopPage/productCard";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

type ProductMutationResult = {
  success: boolean;
  error?: string;
  product?: Product;
};

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const toString = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const toNumber = (value: string, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toStringArray = (value: string) =>
  value
    .split(/,|\n/g)
    .map((item) => item.trim())
    .filter(Boolean);

const parseSpecifications = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return {
        label: label?.trim() || "",
        value: rest.join(":").trim(),
      };
    })
    .filter((spec) => spec.label && spec.value);

async function ensureAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || "softzy/products";

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(signaturePayload)
    .digest("hex");

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body,
    },
  );

  const json = (await response.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !json.secure_url) {
    throw new Error(json.error?.message || "Image upload failed");
  }

  return json.secure_url;
}

async function uploadManyImages(files: File[]) {
  const validFiles = files.filter((file) => file.size > 0);
  if (validFiles.length === 0) return [] as string[];

  const urls = await Promise.all(validFiles.map(uploadImageToCloudinary));
  return urls;
}

function getPayloadFromFormData(formData: FormData) {
  const name = toString(formData.get("name"));
  const slugInput = toString(formData.get("slug"));
  const slug = normalizeSlug(slugInput || name);

  const payload = {
    name,
    slug,
    sku: toString(formData.get("sku")),
    category: toString(formData.get("category")),
    brand: toString(formData.get("brand")) || "softzy",
    price: toNumber(toString(formData.get("price"))),
    originalPrice: toNumber(toString(formData.get("originalPrice"))),
    stockCount: toNumber(toString(formData.get("stockCount"))),
    inStock: toString(formData.get("inStock")) === "true",
    shortDescription: toString(formData.get("shortDescription")),
    description: toString(formData.get("description")),
    tags: toStringArray(toString(formData.get("tags"))),
    features: toStringArray(toString(formData.get("features"))),
    sizes: toStringArray(toString(formData.get("sizes"))),
    careInstructions: toStringArray(toString(formData.get("careInstructions"))),
    specifications: parseSpecifications(toString(formData.get("specifications"))),
    material: toString(formData.get("material")),
    color: toString(formData.get("color")),
    weight: toString(formData.get("weight")),
    dimensions: toString(formData.get("dimensions")),
    warranty: toString(formData.get("warranty")),
    returnPolicy: toString(formData.get("returnPolicy")) || "10-day return policy",
    isFeatured: toString(formData.get("isFeatured")) === "true",
    isTrending: toString(formData.get("isTrending")) === "true",
    isMustTry: toString(formData.get("isMustTry")) === "true",
    rating: toNumber(toString(formData.get("rating")), 0),
    reviews: toNumber(toString(formData.get("reviews")), 0),
  };

  return payload;
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    await connectToDatabase();
    const products = await ProductModel.find({}).lean();
    return products.map(mapToClientProduct);
  } catch {
    // console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  try {
    const isAdmin = await ensureAdminAccess();
    if (!isAdmin) return [];

    await connectToDatabase();
    const products = await ProductModel.find({}).lean();
    return products.map(mapToClientProduct);
  } catch {
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
  } catch {
    // console.error("Failed to fetch related products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await connectToDatabase();
    const doc = await ProductModel.findOne({ slug }).lean();
    if (!doc) return null;
    return mapToClientProduct(doc as Record<string, unknown>);
  } catch {
    // console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function createProductAdmin(
  formData: FormData,
): Promise<ProductMutationResult> {
  try {
    const isAdmin = await ensureAdminAccess();
    if (!isAdmin) return { success: false, error: "Unauthorized" };

    await connectToDatabase();

    const payload = getPayloadFromFormData(formData);
    const imageFiles = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (
      !payload.name ||
      !payload.slug ||
      !payload.sku ||
      !payload.category ||
      !payload.shortDescription ||
      !payload.description
    ) {
      return { success: false, error: "Please fill all required fields." };
    }

    if (payload.price <= 0 || payload.originalPrice <= 0) {
      return { success: false, error: "Price and original price must be greater than 0." };
    }

    if (imageFiles.length === 0) {
      return { success: false, error: "At least one product image is required." };
    }

    const [slugExists, skuExists] = await Promise.all([
      ProductModel.findOne({ slug: payload.slug }).lean(),
      ProductModel.findOne({ sku: payload.sku }).lean(),
    ]);

    if (slugExists) {
      return { success: false, error: "Slug must be unique. This slug already exists." };
    }

    if (skuExists) {
      return { success: false, error: "SKU must be unique. This SKU already exists." };
    }

    const uploadedUrls = await uploadManyImages(imageFiles);

    const doc = await ProductModel.create({
      ...payload,
      images: uploadedUrls,
      inStock: payload.inStock && payload.stockCount > 0,
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/product/${doc.slug}`);

    return {
      success: true,
      product: mapToClientProduct(doc.toObject() as Record<string, unknown>),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return { success: false, error: message };
  }
}

export async function updateProductAdmin(
  formData: FormData,
): Promise<ProductMutationResult> {
  try {
    const isAdmin = await ensureAdminAccess();
    if (!isAdmin) return { success: false, error: "Unauthorized" };

    await connectToDatabase();

    const id = toString(formData.get("id"));
    if (!id) return { success: false, error: "Missing product id." };

    const existing = await ProductModel.findById(id);
    if (!existing) return { success: false, error: "Product not found." };

    const payload = getPayloadFromFormData(formData);
    const keepImagesRaw = toString(formData.get("keepImages"));
    let keepImages: string[] = [];

    if (keepImagesRaw) {
      try {
        const parsed = JSON.parse(keepImagesRaw) as unknown;
        if (Array.isArray(parsed)) {
          keepImages = parsed.filter((img): img is string => typeof img === "string");
        }
      } catch {
        return { success: false, error: "Invalid keepImages payload." };
      }
    }

    const imageFiles = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    const uploadedUrls = await uploadManyImages(imageFiles);
    const finalImages = [...keepImages, ...uploadedUrls];

    if (finalImages.length === 0) {
      return { success: false, error: "At least one image is required." };
    }

    const [slugExists, skuExists] = await Promise.all([
      ProductModel.findOne({ slug: payload.slug, _id: { $ne: id } }).lean(),
      ProductModel.findOne({ sku: payload.sku, _id: { $ne: id } }).lean(),
    ]);

    if (slugExists) {
      return { success: false, error: "Slug must be unique. This slug already exists." };
    }

    if (skuExists) {
      return { success: false, error: "SKU must be unique. This SKU already exists." };
    }

    const updated = await ProductModel.findByIdAndUpdate(
      id,
      {
        ...payload,
        images: finalImages,
        inStock: payload.inStock && payload.stockCount > 0,
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return { success: false, error: "Failed to update product." };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/product/${updated.slug}`);

    return {
      success: true,
      product: mapToClientProduct(updated.toObject() as Record<string, unknown>),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return { success: false, error: message };
  }
}

export async function deleteProductAdmin(id: string): Promise<ProductMutationResult> {
  try {
    const isAdmin = await ensureAdminAccess();
    if (!isAdmin) return { success: false, error: "Unauthorized" };

    await connectToDatabase();

    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: "Product not found." };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/product/${deleted.slug}`);

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    return { success: false, error: message };
  }
}