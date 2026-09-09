import Link from "next/link";

import { Header } from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="flex min-h-[calc(100vh-73px)] items-center px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
            Personal streaming library
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight">Tsukuyomi</h1>

          <p className="mt-5 max-w-xl text-lg text-gray-300">
            Browse your movies, open a title, and continue building your own
            Netflix-style catalog step by step.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              href="/movies"
              className="rounded bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500"
            >
              Browse movies
            </Link>

            <Link
              href="/admin/movies"
              className="rounded border border-gray-800 px-5 py-3 text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white"
            >
              Manage catalog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
