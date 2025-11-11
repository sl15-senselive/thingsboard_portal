import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the User object returned from authorize()
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string; // ✅ add custom role field
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

// Extend the JWT token type
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
