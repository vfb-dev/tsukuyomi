"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ListVideo,
  Play,
} from "lucide-react";

import { FavoriteButton } from "@/components/FavoriteButton";
import { HeroImage } from "@/components/HeroImage";
import { PosterImage } from "@/components/PosterImage";
import { VideoPlayer } from "@/components/VideoPlayer";
import {
  getEpisodeWatchProgress,
  getEpisodes,
  getMovie,
  getWatchProgress,
  saveEpisodeWatchProgress,
  saveWatchProgress,
} from "@/lib/api";
import { Episode } from "@/types/episode";
import { Movie } from "@/types/movie";
import {
  EpisodeWatchProgress,
  WatchProgress,
} from "@/types/watchProgress";

type MovieDetailsPageContentProps = {
  movieId: number;
  initialEpisodeId?: number | null;
};

export function MovieDetailsPageContent({
  movieId,
  initialEpisodeId = null,
}: MovieDetailsPageContentProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [progress, setProgress] = useState<WatchProgress | null>(null);
  const [episodeProgressById, setEpisodeProgressById] = useState<
    Record<number, EpisodeWatchProgress>
  >({});
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
        const loadedEpisodeProgressById: Record<number, EpisodeWatchProgress> =
          {};

        if (isAnime) {
          const loadedEpisodeProgress = await Promise.all(
            loadedEpisodes.map((episode) =>
              getEpisodeWatchProgress(loadedMovie.id, episode.id),
            ),
          );

          loadedEpisodeProgress.forEach((episodeProgress) => {
            loadedEpisodeProgressById[episodeProgress.episodeId] =
              episodeProgress;
          });
        }

        setMovie(loadedMovie);
        setProgress(loadedProgress);
        setEpisodes(loadedEpisodes);
        setEpisodeProgressById(loadedEpisodeProgressById);
        const requestedEpisodeExists = loadedEpisodes.some(
          (episode) => episode.id === initialEpisodeId,
        );
        const selectedEpisodeIdFromUrl =
          initialEpisodeId && requestedEpisodeExists ? initialEpisodeId : null;

        setSelectedEpisodeId(
          isAnime
            ? (selectedEpisodeIdFromUrl ?? loadedEpisodes[0]?.id ?? null)
            : null,
        );
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadDetails();
  }, [movieId, initialEpisodeId]);

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
  const selectedEpisodeProgress = selectedEpisode
    ? episodeProgressById[selectedEpisode.id]
    : null;
  const selectedEpisodeProgressMinutes = selectedEpisodeProgress
    ? Math.floor(selectedEpisodeProgress.progressSeconds / 60)
    : 0;
  const activeVideoTitle = selectedEpisode
    ? `S${selectedEpisode.seasonNumber} E${selectedEpisode.episodeNumber}: ${selectedEpisode.title}`
    : movie.title;
  const canWatch = isAnime
    ? Boolean(selectedEpisode)
    : Boolean(movie.videoUrl && progress);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <Link
        href="/movies"
        className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <ArrowLeft
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
        />
        Back to catalog
      </Link>

      <div className="relative mt-6 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
        <HeroImage
          src={movie.backdropUrl || movie.posterUrl}
          alt=""
          className="object-cover object-[68%_center] opacity-60 sm:opacity-70"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent"
        />

        <div className="relative z-10 grid gap-8 p-5 sm:p-8 lg:min-h-[36rem] lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-end lg:gap-10 lg:p-10">
          <div className="mx-auto w-40 shrink-0 sm:w-52 lg:mx-0 lg:w-full">
            <PosterImage
              src={movie.posterUrl}
              alt={movie.title}
              className="aspect-[2/3] w-full rounded border border-white/10 object-cover shadow-2xl"
            />
          </div>

          <div className="min-w-0 max-w-3xl lg:pb-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
              {isAnime ? "Anime" : "Movie"}
            </span>
            <span className="rounded border border-white/20 bg-black/30 px-2.5 py-1 text-xs text-zinc-200">
              {movie.category}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {movie.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-200">
            <span className="inline-flex items-center gap-2">
              <CalendarDays
                aria-hidden="true"
                className="h-4 w-4 text-zinc-400"
              />
              {movie.releaseYear}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 aria-hidden="true" className="h-4 w-4 text-zinc-400" />
              {movie.durationMinutes} min
            </span>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-200 sm:text-base">
            {movie.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {canWatch && (
              <Link
                href="#watch"
                className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Play aria-hidden="true" className="h-4 w-4 fill-current" />
                {isAnime ? "Watch episode" : "Watch now"}
              </Link>
            )}
            <FavoriteButton
              movieId={movie.id}
              initialFavorite={movie.favorite}
            />
          </div>

          {!isAnime && progress && (
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-300">
              {progress.completed ? (
                <Check
                  aria-hidden="true"
                  className="h-4 w-4 text-emerald-400"
                />
              ) : (
                <Clock3
                  aria-hidden="true"
                  className="h-4 w-4 text-zinc-400"
                />
              )}
              {progress.completed
                ? "Completed"
                : progressMinutes > 0
                  ? `Continue from ${progressMinutes} min`
                  : "Ready to watch"}
            </div>
          )}
        </div>
      </div>
      </div>

      {!isAnime && movie.videoUrl && progress && (
        <section id="watch" className="scroll-mt-24 mt-10 border-t border-zinc-900 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-red-400 uppercase">
                Now watching
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {movie.title}
              </h2>
            </div>
            {progress.completed && (
              <span className="inline-flex items-center gap-2 text-sm text-emerald-400">
                <Check aria-hidden="true" className="h-4 w-4" />
                Completed
              </span>
            )}
          </div>

          <VideoPlayer
            key={`${movie.id}-movie`}
            className="mt-5"
            videoUrl={movie.videoUrl}
            initialProgressSeconds={progress.progressSeconds}
            onSaveProgress={async (progressInput) => {
              const savedProgress = await saveWatchProgress(
                movie.id,
                progressInput,
              );

              setProgress(savedProgress);
            }}
          />
        </section>
      )}

      {isAnime && selectedEpisode && (
        <section id="watch" className="scroll-mt-24 mt-10 border-t border-zinc-900 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-red-400 uppercase">
                Now watching
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {activeVideoTitle}
              </h2>
            </div>
            {selectedEpisodeProgress && (
              <span
                className={`text-sm ${selectedEpisodeProgress.completed ? "text-emerald-400" : "text-zinc-400"}`}
              >
                {selectedEpisodeProgress.completed
                  ? "Completed"
                  : selectedEpisodeProgressMinutes > 0
                    ? `${selectedEpisodeProgressMinutes} min watched`
                    : "Not started"}
              </span>
            )}
          </div>

          <VideoPlayer
            key={`${movie.id}-${selectedEpisode.id}`}
            className="mt-5"
            videoUrl={selectedEpisode.videoUrl}
            initialProgressSeconds={selectedEpisodeProgress?.progressSeconds ?? 0}
            onSaveProgress={async (progressInput) => {
              const savedProgress = await saveEpisodeWatchProgress(
                movie.id,
                selectedEpisode.id,
                progressInput,
              );

              setEpisodeProgressById((currentProgress) => ({
                ...currentProgress,
                [selectedEpisode.id]: savedProgress,
              }));
            }}
          />
        </section>
      )}

      {isAnime && (
        <section className="mt-12 border-t border-zinc-900 pt-8">
          <div className="flex items-center gap-2">
            <ListVideo aria-hidden="true" className="h-5 w-5 text-zinc-400" />
            <div>
              <h2 className="text-2xl font-semibold text-white">Episodes</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {episodes.length} {episodes.length === 1 ? "episode" : "episodes"}
              </p>
            </div>
          </div>

          {episodes.length === 0 ? (
            <div className="mt-5 border border-dashed border-zinc-800 px-5 py-6">
              <p className="text-sm text-zinc-400">No episodes added yet.</p>
            </div>
          ) : (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {episodes.map((episode) => {
              const isSelected = episode.id === selectedEpisode?.id;
              const episodeProgress = episodeProgressById[episode.id];
              const episodeProgressPercent = episodeProgress
                ? episodeProgress.completed
                  ? 100
                  : Math.min(
                      100,
                      Math.round(
                        (episodeProgress.progressSeconds /
                          Math.max(episode.durationMinutes * 60, 1)) *
                          100,
                      ),
                    )
                : 0;

              return (
                <button
                  key={episode.id}
                  type="button"
                  onClick={() => setSelectedEpisodeId(episode.id)}
                  aria-pressed={isSelected}
                  className={`group flex min-w-0 items-center gap-3 border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                    isSelected
                      ? "border-red-600/70 bg-red-600/10"
                      : "border-zinc-800 bg-zinc-950 hover:border-zinc-600"
                  }`}
                >
                  <span
                    className={`flex h-10 w-12 shrink-0 items-center justify-center rounded text-xs font-semibold ${
                      isSelected
                        ? "bg-red-600 text-white"
                        : "bg-zinc-900 text-zinc-300"
                    }`}
                  >
                    S{String(episode.seasonNumber).padStart(2, "0")} E
                    {String(episode.episodeNumber).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-white">
                      {episode.title}
                    </span>
                    <span className="mt-1 block text-xs text-zinc-500">
                      {episode.durationMinutes} min
                      {episodeProgress?.completed
                        ? " · Completed"
                        : episodeProgress && episodeProgress.progressSeconds > 0
                          ? ` · ${Math.floor(episodeProgress.progressSeconds / 60)} min watched`
                          : ""}
                    </span>
                    {episodeProgressPercent > 0 && (
                      <span className="mt-2 block h-1 overflow-hidden rounded-full bg-zinc-800">
                        <span
                          className="block h-full bg-red-500"
                          style={{ width: `${episodeProgressPercent}%` }}
                        />
                      </span>
                    )}
                  </span>

                  <ChevronRight
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      isSelected ? "text-red-400" : "text-zinc-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          )}
        </section>
      )}
    </section>
  );
}
