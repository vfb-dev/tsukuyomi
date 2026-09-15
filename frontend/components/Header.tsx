"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Film,
  Heart,
  LogIn,
  Menu,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";

import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/components/AuthProvider";
import { TsukuyomiLogo } from "@/components/TsukuyomiLogo";

export function Header() {
  const pathname = usePathname();
  const { currentUser, isLoading: isLoadingUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === "ADMIN";
  const navLinkClass = (isActive: boolean) =>
    `inline-flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition sm:w-auto sm:px-2 ${
      isActive
        ? "bg-zinc-900 text-white"
        : "text-zinc-400 hover:bg-zinc-950 hover:text-white"
    }`;

  return (
    <header className="border-b border-zinc-900 bg-black px-4 py-3 text-white sm:px-8 sm:py-4">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Tsukuyomi home"
          onClick={() => setIsMenuOpen(false)}
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <TsukuyomiLogo />
        </Link>

        <button
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="relative flex h-10 w-10 items-center justify-center rounded border border-zinc-800 text-zinc-300 transition hover:border-zinc-600 hover:text-white sm:hidden"
        >
          {isMenuOpen ? (
            <X aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Menu aria-hidden="true" className="h-5 w-5" />
          )}
        </button>

        <div
          id="primary-navigation"
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } mt-4 w-full flex-col gap-1 border-t border-zinc-900 pt-3 sm:mt-0 sm:flex sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:border-0 sm:pt-0`}
        >
          {currentUser && (
            <>
              <Link
                href="/movies"
                onClick={() => setIsMenuOpen(false)}
                className={navLinkClass(
                  pathname === "/movies" || pathname.startsWith("/movies/"),
                )}
              >
                <Film aria-hidden="true" className="h-4 w-4" />
                Catalog
              </Link>

              <Link
                href="/favorites"
                onClick={() => setIsMenuOpen(false)}
                className={navLinkClass(pathname === "/favorites")}
              >
                <Heart aria-hidden="true" className="h-4 w-4" />
                Favorites
              </Link>

              {isAdmin && (
                <>
                  <Link
                    href="/admin/movies"
                    onClick={() => setIsMenuOpen(false)}
                    className={navLinkClass(
                      pathname.startsWith("/admin/movies"),
                    )}
                  >
                    <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                    Admin
                  </Link>

                  <Link
                    href="/admin/users"
                    onClick={() => setIsMenuOpen(false)}
                    className={navLinkClass(
                      pathname.startsWith("/admin/users"),
                    )}
                  >
                    <UsersRound aria-hidden="true" className="h-4 w-4" />
                    Users
                  </Link>
                </>
              )}

              <div className="border-t border-zinc-900 pt-2 sm:border-0 sm:pt-0">
                <LogoutButton />
              </div>
            </>
          )}

          {!isLoadingUser && !currentUser && (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500"
            >
              <LogIn aria-hidden="true" className="h-4 w-4" />
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
