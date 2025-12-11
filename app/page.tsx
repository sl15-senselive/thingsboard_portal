'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      // Not logged in
      router.push("/auth");
      return;
    }
    console.log(session?.user);
    // Redirect based on role
    const role = session?.user?.role;
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "user") {
      router.push("/dashboard");
    } else {
      // Unknown role, redirect to auth
      router.push("/auth");
    }
  }, [session, status, router]);

  return <div className=""></div>;
}