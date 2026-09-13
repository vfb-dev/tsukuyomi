"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCurrentUser } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

export function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const token = getAuthToken();

      if (!token) {
        return;
      }

      try {
        const user = await getCurrentUser(token);
        setIsAdmin(user.role === "ADMIN");
      } catch {
        setIsAdmin(false);
      }
    }

    loadUser();
  }, []);

  return (
    <header className="border-b border-gray-900 bg-black px-8 py-4 text-white">
      <nav className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-red-600">
          Tsukuyomi
        </Link>

        <div className="flex items-center gap-5 text-sm text-gray-300">
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
        </div>
      </nav>
    </header>
  );
}
