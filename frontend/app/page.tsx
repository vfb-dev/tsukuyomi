import Link from "next/link";

import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { getMovies } from "@/lib/api";

type HomeProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { search, category } = await searchParams;
  const movies = await getMovies({ search, category });
  const hasFilters = Boolean(search || category);

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="px-8 py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Movies</h1>
            <p className="mt-2 text-sm text-gray-400">
              Browse your personal catalog.
            </p>
          </div>

          <form className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search movies"
              className="w-full rounded border border-gray-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-600 sm:w-64"
            />

            <input
              type="text"
              name="category"
              defaultValue={category ?? ""}
              placeholder="Category"
              className="w-full rounded border border-gray-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-600 sm:w-44"
            />

            <button
              type="submit"
              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Filter
            </button>

            {hasFilters && (
              <Link
                href="/"
                className="rounded border border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {movies.length === 0 ? (
          <p className="mt-8 text-gray-400">No movies found.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
