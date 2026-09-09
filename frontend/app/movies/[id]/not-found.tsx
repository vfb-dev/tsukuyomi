import Link from "next/link";

import { Header } from "@/components/Header";

export default function MovieNotFound() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="px-8 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
          Movie not found
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          This title is not available.
        </h1>

        <p className="mt-4 max-w-xl text-gray-400">
          The movie may have been deleted from your catalog, or the link may be
          incorrect.
        </p>

        <Link
          href="/movies"
          className="mt-8 inline-block rounded bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500"
        >
          Back to movies
        </Link>
      </section>
    </main>
  );
}
