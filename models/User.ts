import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string; 
  quantity: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  cart: ICartItem[];
  orders: mongoose.Types.ObjectId[]; 
  
  // NEW FIELDS
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

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
    
    // NEW FIELDS
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;