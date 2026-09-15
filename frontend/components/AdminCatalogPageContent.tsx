"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Film, Pencil, Plus, RefreshCw, Tv } from "lucide-react";

import { DeleteMovieButton } from "@/components/DeleteMovieButton";
import { PosterImage } from "@/components/PosterImage";
import { getMovies } from "@/lib/api";
import { Movie } from "@/types/movie";

export function AdminCatalogPageContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function loadMovies() {
    try {
      setIsRefreshing(true);
      setHasError(false);
      const loadedMovies = await getMovies();
      setMovies(loadedMovies);
    } catch {
      setHasError(true);
    } finally {
      setIsRefreshing(false);
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

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Admin catalog
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Manage the movies and anime in your library.
          </p>
        </div>

        <Link
          href="/admin/movies/new"
          className="inline-flex items-center justify-center gap-2 self-start rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 sm:self-auto"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add title
        </Link>
      </header>

      <section className="mt-8 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">Catalog</h2>
              {!isLoading && !hasError && (
                <span className="text-xs text-zinc-600">
                  {movies.length} {movies.length === 1 ? "title" : "titles"}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => void loadMovies()}
              disabled={isLoading || isRefreshing}
              aria-label="Refresh catalog"
              title="Refresh catalog"
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-zinc-800 text-zinc-500 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                aria-hidden="true"
                className={`h-4 w-4 ${isLoading || isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {hasError && movies.length === 0 && !isRefreshing && (
            <div className="mt-5 border-y border-zinc-900 py-8">
              <p className="text-sm text-red-400">Could not load catalog.</p>
              <button
                type="button"
                onClick={() => void loadMovies()}
                className="mt-3 text-xs font-semibold text-zinc-400 underline underline-offset-4 transition hover:text-white"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isRefreshing && !hasError && movies.length === 0 && (
            <div className="mt-5 border-y border-zinc-900 py-12 text-center">
              <Film aria-hidden="true" className="mx-auto h-7 w-7 text-zinc-700" />
              <p className="mt-3 text-sm text-zinc-500">Your catalog is empty.</p>
            </div>
          )}

          {!isLoading && movies.length > 0 && (
            <div className="mt-5 overflow-x-auto border-y border-zinc-900">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-zinc-600">
                  <tr>
                    <th className="px-2 py-3 font-semibold">Title</th>
                    <th className="px-2 py-3 font-semibold">Type</th>
                    <th className="px-2 py-3 font-semibold">Category</th>
                    <th className="px-2 py-3 font-semibold">Year</th>
                    <th className="px-2 py-3 font-semibold">Duration</th>
                    <th className="px-2 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-900">
                  {movies.map((movie) => (
                    <tr key={movie.id} className="transition hover:bg-zinc-950">
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          <PosterImage
                            src={movie.posterUrl}
                            alt=""
                            className="h-14 w-10 shrink-0 rounded object-cover"
                          />
                          <span className="max-w-48 truncate font-medium text-white">
                            {movie.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                          {movie.mediaType === "ANIME" ? (
                            <Tv aria-hidden="true" className="h-3.5 w-3.5 text-red-400" />
                          ) : (
                            <Film aria-hidden="true" className="h-3.5 w-3.5" />
                          )}
                          {movie.mediaType === "ANIME" ? "Anime" : "Movie"}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-zinc-500">{movie.category}</td>
                      <td className="px-2 py-3 text-zinc-500">{movie.releaseYear}</td>
                      <td className="px-2 py-3 text-zinc-500">
                        {movie.durationMinutes} min
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/movies/${movie.id}/edit`}
                            aria-label={`Edit ${movie.title}`}
                            title={`Edit ${movie.title}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-white"
                          >
                            <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <DeleteMovieButton
                            movieId={movie.id}
                            onDeleted={loadMovies}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>

    </section>
  );
}
