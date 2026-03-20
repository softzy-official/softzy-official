"use server";

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getUserProfile() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) throw new Error("Unauthorized");

    await connectToDatabase();
    
    const dbUser = await User.findById(session.user.id).lean();
    if (!dbUser) return null;

    return JSON.parse(JSON.stringify(dbUser));
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Inside app/actions/userActions.ts

export async function updateProfile(data: { name?: string, phone: string, address: Record<string, unknown> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, message: "Unauthorized" };

    await connectToDatabase();
    
    // Update name explicitly so we overwrite dummy names
    const updateData: Record<string, unknown> = { 
      phone: data.phone, 
      address: data.address 
    };
    
    if (data.name && data.name.trim() !== "") {
      updateData.name = data.name;
    }

    await User.findByIdAndUpdate(session.user.id, { $set: updateData });

    return { success: true };
  } catch (_error) {
    return { success: false, message: "Internal server error" };
  }
}