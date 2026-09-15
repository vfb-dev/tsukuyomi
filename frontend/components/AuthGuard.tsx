"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace("/login");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black px-8 py-10 text-white">
        <p className="text-sm text-zinc-400">Checking access...</p>
      </main>
    );
  }

  if (!currentUser) {
    return null;
  }

  return children;
}
