"use client";

import { FormEvent, useEffect, useState } from "react";

import { MovieCard } from "@/components/MovieCard";
import { getMovies } from "@/lib/api";
import { Movie } from "@/types/movie";

export function CatalogPageContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  async function loadMovies(
    nextSearch = activeSearch,
    nextCategory = activeCategory,
  ) {
    try {
      setIsLoading(true);
      setHasError(false);

      const loadedMovies = await getMovies({
        search: nextSearch,
        category: nextCategory,
      });

      setMovies(loadedMovies);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialMovies() {
      try {
        const loadedMovies = await getMovies();
        setMovies(loadedMovies);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialMovies();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setActiveSearch(search);
    setActiveCategory(category);
    loadMovies(search, category);
  }

  function handleClear() {
    setSearch("");
    setCategory("");
    setActiveSearch("");
    setActiveCategory("");
    loadMovies("", "");
  }

  const hasFilters = Boolean(activeSearch || activeCategory);

  return (
    <section className="px-8 py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catalog</h1>
          <p className="mt-2 text-sm text-gray-400">
            Browse everything currently available in your catalog.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search catalog"
            className="w-full rounded border border-gray-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-600 sm:w-64"
          />

          <input
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
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
            <button
              type="button"
              onClick={handleClear}
              className="rounded border border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {isLoading && (
        <p className="mt-8 text-sm text-zinc-500">Loading catalog...</p>
      )}

      {hasError && (
        <p className="mt-8 text-sm text-red-400">Could not load catalog.</p>
      )}

      {!isLoading && !hasError && movies.length === 0 && (
        <p className="mt-8 text-gray-400">No catalog items found.</p>
      )}

      {!isLoading && !hasError && movies.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
