"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!currentUser) {
      router.replace("/login");
    } else if (currentUser.role !== "ADMIN") {
      router.replace("/");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black px-8 py-10 text-white">
        <p className="text-sm text-zinc-400">Checking access...</p>
      </main>
    );
  }

  if (!currentUser || currentUser.role !== "ADMIN") {
    return null;
  }

  return children;
}
