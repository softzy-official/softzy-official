import NextAuth, { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// --- Type Extensions ---
declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      phone?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    phone?: string;
  }
}
// -----------------------

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Admin Login (Fixed ENV)
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Admin Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin-1", email: credentials.email, role: "admin" };
        }
        return null;
      },
    }),

    // 2. User OTP Login (Mobile Placeholder)
    CredentialsProvider({
      id: "user-otp-login",
      name: "OTP Login",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null;

        if (credentials.otp === "123456") {
          return { 
            id: `user-${Date.now()}`, 
            name: "Customer", 
            phone: credentials.phone, 
            role: "user" 
          };
        }
        return null; 
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/auth/login",
  },
  
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };