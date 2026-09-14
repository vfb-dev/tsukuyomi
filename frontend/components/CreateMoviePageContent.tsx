"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { CreateMovieForm } from "@/components/CreateMovieForm";

export function CreateMoviePageContent() {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <div className="mb-8">
        <Link
          href="/admin/movies"
          className="text-sm text-red-400 transition hover:text-red-300"
        >
          Back to admin catalog
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Add title
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Add a movie or anime to your catalog.
        </p>
      </div>

      <CreateMovieForm onMovieCreated={() => router.push("/admin/movies")} />
    </section>
  );
}
