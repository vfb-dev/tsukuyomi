"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LogoutButton } from "@/components/LogoutButton";
import { getCurrentUser } from "@/lib/api";
import { getAuthToken, removeAuthToken } from "@/lib/auth";
import { AuthUser } from "@/types/auth";

export function Header() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getAuthToken();

      if (!token) {
        setCurrentUser(null);
        setIsLoadingUser(false);
        return;
      }

      try {
        const user = await getCurrentUser(token);
        setCurrentUser(user);
      } catch {
        removeAuthToken();
        setCurrentUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <header className="border-b border-gray-900 bg-black px-8 py-4 text-white">
      <nav className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-red-600">
          Tsukuyomi
        </Link>

        <div className="flex items-center gap-5 text-sm text-gray-300">
          {currentUser && (
            <>
              <Link href="/movies" className="hover:text-white">
                Catalog
              </Link>

              <Link href="/favorites" className="hover:text-white">
                Favorites
              </Link>

              {isAdmin && (
                <>
                  <Link href="/admin/movies" className="hover:text-white">
                    Admin
                  </Link>

                  <Link href="/admin/users" className="hover:text-white">
                    Users
                  </Link>
                </>
              )}

              <LogoutButton />
            </>
          )}

          {!isLoadingUser && !currentUser && (
            <Link
              href="/login"
              className="rounded bg-red-600 px-3 py-2 font-medium text-white hover:bg-red-500"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
