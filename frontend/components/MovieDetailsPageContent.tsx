"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FavoriteButton } from "@/components/FavoriteButton";
import { PosterImage } from "@/components/PosterImage";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getEpisodes, getMovie, getWatchProgress } from "@/lib/api";
import { Episode } from "@/types/episode";
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
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(
    null,
  );
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

        const isAnime = loadedMovie.mediaType === "ANIME";
        const [loadedProgress, loadedEpisodes] = await Promise.all([
          isAnime ? Promise.resolve(null) : getWatchProgress(loadedMovie.id),
          isAnime ? getEpisodes(loadedMovie.id) : Promise.resolve([]),
        ]);

        setMovie(loadedMovie);
        setProgress(loadedProgress);
        setEpisodes(loadedEpisodes);
        setSelectedEpisodeId(isAnime ? (loadedEpisodes[0]?.id ?? null) : null);
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

  if (!movie || (movie.mediaType !== "ANIME" && !progress)) {
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

  const isAnime = movie.mediaType === "ANIME";
  const progressMinutes = progress
    ? Math.floor(progress.progressSeconds / 60)
    : 0;
  const selectedEpisode =
    isAnime && selectedEpisodeId
      ? episodes.find((episode) => episode.id === selectedEpisodeId) ?? null
      : null;
  const activeVideoTitle = selectedEpisode
    ? `S${selectedEpisode.seasonNumber} E${selectedEpisode.episodeNumber}: ${selectedEpisode.title}`
    : movie.title;

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

          {!isAnime && progress && (
            <p className="mt-6 text-sm text-zinc-400">
              Saved progress: {progressMinutes} min
              {progress.completed ? " • Completed" : ""}
            </p>
          )}
        </div>
      </div>

      {!isAnime && movie.videoUrl && progress && (
        <VideoPlayer
          key={`${movie.id}-movie`}
          movieId={movie.id}
          videoUrl={movie.videoUrl}
          initialProgressSeconds={progress.progressSeconds}
        />
      )}

      {isAnime && selectedEpisode && (
        <VideoPlayer
          key={`${movie.id}-${selectedEpisode.id}`}
          movieId={movie.id}
          videoUrl={selectedEpisode.videoUrl}
          initialProgressSeconds={0}
        />
      )}

      {isAnime && episodes.length === 0 && (
        <p className="mt-10 rounded border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
          No episodes added yet.
        </p>
      )}

      {isAnime && episodes.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Episodes</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Now playing: {activeVideoTitle}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {episodes.map((episode) => {
              const isSelected = episode.id === selectedEpisode?.id;

              return (
                <button
                  key={episode.id}
                  type="button"
                  onClick={() => setSelectedEpisodeId(episode.id)}
                  className={`rounded border px-4 py-3 text-left transition ${
                    isSelected
                      ? "border-red-600 bg-red-600/10"
                      : "border-zinc-800 bg-zinc-950 hover:border-zinc-600"
                  }`}
                >
                  <p className="text-sm text-zinc-500">
                    Season {episode.seasonNumber} • Episode{" "}
                    {episode.episodeNumber}
                  </p>
                  <p className="mt-1 font-semibold text-white">
                    {episode.title}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {episode.durationMinutes} min
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
}
