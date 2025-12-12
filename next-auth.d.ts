import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the User object returned from authorize()
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      tb_token?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string;
    tb_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    tb_token?: string;
    tb_token_exp?: number;
  }
}

