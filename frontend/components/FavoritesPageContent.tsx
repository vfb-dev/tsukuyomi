"use client";

import { useEffect, useState } from "react";
import { Heart, SearchX } from "lucide-react";

import { MovieCard } from "@/components/MovieCard";
import { getMovies } from "@/lib/api";
import { Movie } from "@/types/movie";

export function FavoritesPageContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const favoriteMovies = await getMovies({ favorite: true });
        setMovies(favoriteMovies);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <div className="border-b border-zinc-900 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Favorites
          </h1>
          {!isLoading && !hasError && (
            <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs font-semibold text-zinc-400">
              {movies.length} {movies.length === 1 ? "title" : "titles"}
            </span>
          )}
        </div>

        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
          Your personal shortlist of movies and anime worth coming back to.
        </p>
      </div>

      {hasError && (
        <div className="mt-10 flex flex-col items-center border-y border-zinc-900 py-16 text-center">
          <SearchX aria-hidden="true" className="h-8 w-8 text-zinc-700" />
          <p className="mt-4 text-sm text-red-400">
            Could not load your favorites.
          </p>
        </div>
      )}

      {!isLoading && !hasError && movies.length === 0 && (
        <div className="mt-10 flex flex-col items-center border-y border-zinc-900 py-16 text-center">
          <Heart aria-hidden="true" className="h-8 w-8 text-zinc-700" />
          <h2 className="mt-4 text-lg font-semibold text-white">
            Your favorites are empty
          </h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            Save titles from the catalog and they will appear here.
          </p>
        </div>
      )}

      {!isLoading && !hasError && movies.length > 0 && (
        <div className="mt-8 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
