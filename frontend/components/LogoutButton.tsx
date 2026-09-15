"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import { logout as logoutUser } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      logout();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex w-full items-center justify-start gap-2 rounded border border-zinc-800 px-3 py-2 text-left text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white sm:w-auto sm:justify-center sm:text-center"
    >
      <LogOut aria-hidden="true" className="h-4 w-4" />
      Log out
    </button>
  );
}
