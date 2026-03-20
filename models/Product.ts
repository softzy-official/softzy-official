// models/Product.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISpecification {
  label: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  isMustTry?: boolean;
  price: number;
  originalPrice: number;
  images: string[];
  rating: number;
  reviews: number;
  tags: string[];
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: ISpecification[];
  careInstructions: string[];
  material: string;
  color: string;
  sizes: string[];
  inStock: boolean;
  stockCount: number;
  sku: string;
  brand: string;
  weight: string;
  dimensions: string;
  warranty: string;
  returnPolicy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SpecificationSchema = new Schema<ISpecification>({
  label: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false }); // Disable _id for sub-documents to keep it clean

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isMustTry: { type: Boolean, default: false },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    images: { type: [String], required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    specifications: { type: [SpecificationSchema], default: [] },
    careInstructions: { type: [String], default: [] },
    material: { type: String },
    color: { type: String },
    sizes: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, unique: true },
    brand: { type: String, default: "Softzy" },
    weight: { type: String },
    dimensions: { type: String },
    warranty: { type: String },
    returnPolicy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);