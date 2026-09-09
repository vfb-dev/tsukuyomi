import Link from "next/link";

import { Header } from "@/components/Header";

export default function AdminMovieNotFound() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="px-8 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
          Movie not found
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          This movie cannot be edited.
        </h1>

        <p className="mt-4 max-w-xl text-gray-400">
          It may have been deleted from the catalog, or the admin link may be
          incorrect.
        </p>

        <Link
          href="/admin/movies"
          className="mt-8 inline-block rounded bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500"
        >
          Back to admin
        </Link>
      </section>
    </main>
  );
}
