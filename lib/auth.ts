// lib/auth.ts
import { jwtDecode } from "jwt-decode";

export const AuthService = {
  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      // optionally decode and check expiration
      const { exp }: any = jwtDecode(token);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return jwtDecode(token);
    } catch {
      return null;
    }
  },

  async logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("token");
  },
};
