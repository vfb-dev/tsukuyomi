"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import { getAuthToken, removeAuthToken } from "@/lib/auth";

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = getAuthToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const user = await getCurrentUser(token);

        if (user.role !== "ADMIN") {
          router.replace("/");
          return;
        }

        setIsCheckingAuth(false);
      } catch {
        removeAuthToken();
        router.replace("/login");
      }
    }

    checkAuth();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-black px-8 py-10 text-white">
        <p className="text-sm text-zinc-400">Checking access...</p>
      </main>
    );
  }

  return children;
}
