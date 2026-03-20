import NextAuth, {
  NextAuthOptions,
  DefaultSession,
  DefaultUser,
} from "next-auth";
import "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // ✅ Admin Login
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
          return {
            id: "admin-1",
            email: credentials.email,
            role: "admin",
          };
        }

        return null;
      },
    }),

    // ✅ Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // ✅ Handle Google user creation
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectToDatabase();

          const existingUser = await User.findOne({
            email: user.email,
          });

          let dbUser;

          if (!existingUser) {
            dbUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user",
            });
          } else {
            dbUser = existingUser;
          }

          // ✅ IMPORTANT: attach DB data safely
          user.id = dbUser._id.toString();
          user.role = dbUser.role || "user";

          return true;
        } catch (error) {
          console.error("Error saving Google user to DB:", error);
          return false;
        }
      }

      return true;
    },

    // ✅ JWT callback
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // ✅ Session callback
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
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