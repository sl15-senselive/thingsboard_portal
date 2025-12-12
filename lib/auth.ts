import "server-only";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool } from "./db";
import { getTbToken } from "./tb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing Email or Password");
        }

        // Fetch user
        const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
        const { rows } = await pool.query(query, [credentials.email]);
        const user = rows[0];

        if (!user) {
          throw new Error("No User Found");
        }

        // Compare hashed password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid Password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // When user first logs in — fetch a fresh TB token
      if (user) {
        const tbToken = await getTbToken();

        token.tb_token = tbToken;
        token.tb_token_exp = Date.now() + 55 * 60 * 1000; // 55 minutes buffer
      }

      // If TB token expired → refresh it
      if (!token.tb_token || Date.now() > (token.tb_token_exp as number)) {
        const newTbToken = await getTbToken();
        token.tb_token = newTbToken;
        token.tb_token_exp = Date.now() + 55 * 60 * 1000;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;

      // Pass TB token to client session
      session.user.tb_token = token.tb_token as string;

      return session;
    },
  },

  pages: {
    signIn: "/auth",
    error: "/auth",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
