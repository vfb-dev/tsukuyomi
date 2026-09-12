"use client";

import { useRouter } from "next/navigation";
import { removeAuthToken } from "@/lib/auth";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    removeAuthToken();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-500 hover:text-white"
    >
      Log out
    </button>
  );
}
