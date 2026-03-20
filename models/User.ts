import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string; // Storing the first image
  quantity: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  cart: ICartItem[];
  orders: mongoose.Types.ObjectId[]; // Will hold references to an Order model later
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    cart: { type: [CartItemSchema], default: [] },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order", default: [] }],
  },
  { timestamps: true }
);

// Prevent re-compilation of model in Next.js dev environment
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;