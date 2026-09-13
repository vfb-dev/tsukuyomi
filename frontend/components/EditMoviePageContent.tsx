"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EditMovieForm } from "@/components/EditMovieForm";
import { getMovie } from "@/lib/api";
import { Movie } from "@/types/movie";

type EditMoviePageContentProps = {
  movieId: number;
};

export function EditMoviePageContent({ movieId }: EditMoviePageContentProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      try {
        const loadedMovie = await getMovie(movieId);
        setMovie(loadedMovie);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadMovie();
  }, [movieId]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <Link
          href="/admin/movies"
          className="text-sm text-red-400 hover:text-red-300"
        >
          Back to admin
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-white">Edit item</h1>

        {movie && (
          <p className="mt-2 text-sm text-zinc-400">
            Update the catalog information for {movie.title}.
          </p>
        )}
      </div>

      {isLoading && (
        <p className="text-sm text-zinc-500">Loading catalog item...</p>
      )}

      {hasError && (
        <p className="text-sm text-red-400">Could not load catalog item.</p>
      )}

      {!isLoading && !hasError && !movie && (
        <p className="text-sm text-zinc-400">Catalog item not found.</p>
      )}

      {movie && <EditMovieForm movie={movie} />}
    </section>
  );
}
