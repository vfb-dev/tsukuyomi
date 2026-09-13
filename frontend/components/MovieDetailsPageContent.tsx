"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FavoriteButton } from "@/components/FavoriteButton";
import { PosterImage } from "@/components/PosterImage";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getMovie, getWatchProgress } from "@/lib/api";
import { Movie } from "@/types/movie";
import { WatchProgress } from "@/types/watchProgress";

type MovieDetailsPageContentProps = {
  movieId: number;
};

export function MovieDetailsPageContent({
  movieId,
}: MovieDetailsPageContentProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [progress, setProgress] = useState<WatchProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      try {
        const loadedMovie = await getMovie(movieId);

        if (!loadedMovie) {
          setMovie(null);
          return;
        }

        const loadedProgress = await getWatchProgress(loadedMovie.id);

        setMovie(loadedMovie);
        setProgress(loadedProgress);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadDetails();
  }, [movieId]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-8 py-10">
        <p className="text-sm text-zinc-500">Loading catalog item...</p>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="mx-auto max-w-5xl px-8 py-10">
        <p className="text-sm text-red-400">Could not load catalog item.</p>
      </section>
    );
  }

  if (!movie || !progress) {
    return (
      <section className="mx-auto max-w-5xl px-8 py-10">
        <Link
          href="/movies"
          className="text-sm text-red-400 hover:text-red-300"
        >
          Back to catalog
        </Link>
        <p className="mt-8 text-sm text-zinc-400">Catalog item not found.</p>
      </section>
    );
  }

  const progressMinutes = Math.floor(progress.progressSeconds / 60);

  return (
    <section className="mx-auto max-w-5xl px-8 py-10">
      <Link href="/movies" className="text-sm text-red-400 hover:text-red-300">
        Back to catalog
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <PosterImage
          src={movie.posterUrl}
          alt={movie.title}
          className="aspect-[2/3] w-full rounded object-cover"
        />

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
              {movie.category}
            </span>

            <span className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white">
              {movie.mediaType === "ANIME" ? "Anime" : "Movie"}
            </span>

            {movie.favorite && (
              <span className="rounded bg-yellow-500 px-3 py-1 text-sm font-semibold text-black">
                Favorite
              </span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-bold">{movie.title}</h1>

          <p className="mt-3 text-sm text-zinc-400">
            {movie.releaseYear} • {movie.durationMinutes} min
          </p>

          <p className="mt-6 max-w-2xl text-zinc-300">{movie.description}</p>

          <div className="mt-6">
            <FavoriteButton
              movieId={movie.id}
              initialFavorite={movie.favorite}
            />
          </div>

          <p className="mt-6 text-sm text-zinc-400">
            Saved progress: {progressMinutes} min
            {progress.completed ? " • Completed" : ""}
          </p>
        </div>
      </div>

      <VideoPlayer
        movieId={movie.id}
        videoUrl={movie.videoUrl}
        initialProgressSeconds={progress.progressSeconds}
      />
    </section>
  );
}
