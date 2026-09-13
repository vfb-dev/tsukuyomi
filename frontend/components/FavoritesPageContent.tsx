"use client";

import { useEffect, useState } from "react";

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
    <section className="px-8 py-10">
      <h1 className="text-3xl font-bold">Favorites</h1>

      <p className="mt-2 text-sm text-gray-400">
        Catalog items you marked as favorites.
      </p>

      {isLoading && (
        <p className="mt-8 text-sm text-zinc-500">Loading favorites...</p>
      )}

      {hasError && (
        <p className="mt-8 text-sm text-red-400">Could not load favorites.</p>
      )}

      {!isLoading && !hasError && movies.length === 0 && (
        <p className="mt-8 text-gray-400">No favorite items yet.</p>
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
