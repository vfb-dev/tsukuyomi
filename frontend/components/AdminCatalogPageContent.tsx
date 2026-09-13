"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CreateMovieForm } from "@/components/CreateMovieForm";
import { DeleteMovieButton } from "@/components/DeleteMovieButton";
import { LogoutButton } from "@/components/LogoutButton";
import { getMovies } from "@/lib/api";
import { Movie } from "@/types/movie";

export function AdminCatalogPageContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  async function loadMovies() {
    try {
      setHasError(false);
      const loadedMovies = await getMovies();
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

  return (
    <section className="px-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Catalog</h1>
          <p className="mt-2 text-sm text-gray-400">
            Create and manage movies and anime in your catalog.
          </p>
        </div>

        <LogoutButton />
      </div>

      <CreateMovieForm onMovieCreated={loadMovies} />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Existing Catalog Items</h2>

        {isLoading && (
          <p className="mt-4 text-sm text-zinc-500">Loading catalog...</p>
        )}

        {hasError && (
          <p className="mt-4 text-sm text-red-400">Could not load catalog.</p>
        )}

        {!isLoading && !hasError && movies.length === 0 && (
          <p className="mt-4 text-gray-400">No catalog items created yet.</p>
        )}

        {!isLoading && !hasError && movies.length > 0 && (
          <div className="mt-4 overflow-hidden rounded border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950 text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {movies.map((movie) => (
                  <tr key={movie.id} className="bg-black">
                    <td className="px-4 py-3 font-medium text-white">
                      {movie.title}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {movie.mediaType === "ANIME" ? "Anime" : "Movie"}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {movie.category}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {movie.releaseYear}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {movie.durationMinutes} min
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/movies/${movie.id}/edit`}
                          className="text-sm font-medium text-gray-300 hover:text-white"
                        >
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
