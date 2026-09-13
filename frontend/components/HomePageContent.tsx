"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { HomeCatalogRow } from "@/components/HomeCatalogRow";
import { HomeMovieRow } from "@/components/HomeMovieRow";
import { PosterImage } from "@/components/PosterImage";
import { getContinueWatching, getMovies } from "@/lib/api";
import { Movie } from "@/types/movie";
import { ContinueWatchingItem } from "@/types/watchProgress";

export function HomePageContent() {
  const [continueWatchingItems, setContinueWatchingItems] = useState<
    ContinueWatchingItem[]
  >([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadRows() {
      try {
        const [continueWatching, loadedMovies] = await Promise.all([
          getContinueWatching(),
          getMovies(),
        ]);

        setContinueWatchingItems(continueWatching);
        setMovies(loadedMovies);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadRows();
  }, []);

  useEffect(() => {
    if (movies.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setFeaturedIndex((currentIndex) => (currentIndex + 1) % movies.length);
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [movies.length]);

  const featuredMovie = movies[featuredIndex] ?? movies[0] ?? null;
  const animeMovies = movies.filter((movie) => movie.mediaType === "ANIME");
  const filmMovies = movies.filter((movie) => movie.mediaType !== "ANIME");
  const hasMultipleMediaTypes = animeMovies.length > 0 && filmMovies.length > 0;

  function showPreviousFeatured() {
    setFeaturedIndex((currentIndex) =>
      currentIndex === 0 ? movies.length - 1 : currentIndex - 1,
    );
  }

  function showNextFeatured() {
    setFeaturedIndex((currentIndex) => (currentIndex + 1) % movies.length);
  }

  return (
    <>
      <section className="relative isolate min-h-[30rem] overflow-hidden border-b border-zinc-900 bg-black sm:min-h-[34rem]">
        {featuredMovie && (
          <div className="absolute inset-0 z-0">
            <PosterImage
              key={featuredMovie.id}
              src={featuredMovie.posterUrl}
              alt=""
              className="h-full w-full object-cover object-center sm:object-[70%_center]"
            />
          </div>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/45 via-transparent to-transparent sm:inset-y-0 sm:right-auto sm:w-2/3 sm:bg-gradient-to-r sm:from-black/60 sm:via-black/30 sm:to-transparent"
        />

        {movies.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPreviousFeatured}
              aria-label="Show previous featured title"
              className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-black/40 text-zinc-200 transition hover:border-zinc-300 hover:text-white"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={showNextFeatured}
              aria-label="Show next featured title"
              className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-black/40 text-zinc-200 transition hover:border-zinc-300 hover:text-white"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="relative z-10 mx-auto flex min-h-[30rem] max-w-7xl items-end px-6 py-12 pl-14 sm:min-h-[34rem] sm:px-10 sm:py-16 sm:pl-14">
          <div className="max-w-2xl">
            <h1 className="bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
              {featuredMovie?.title ?? "Your next favorite watch"}
            </h1>

            {featuredMovie ? (
              <>
                <p className="mt-4 text-sm font-medium text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
                  {featuredMovie.releaseYear} · {" "}
                  {featuredMovie.mediaType === "ANIME" ? "Anime" : "Movie"} · {" "}
                  {featuredMovie.category}
                </p>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-base">
                  {featuredMovie.description}
                </p>
              </>
            ) : (
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-base">
                A quiet place for the movies and anime you want to keep close.
                Add your first title from the catalog to get started.
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {featuredMovie && (
                <Link
                  href={`/movies/${featuredMovie.id}`}
                  className="rounded bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Watch now
                </Link>
              )}

              <Link
                href="/movies"
                className="rounded border border-zinc-600 bg-black/30 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-300 hover:bg-black/50"
              >
                Browse catalog
              </Link>
            </div>

            {movies.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
                <span>{movies.length} titles</span>
                {animeMovies.length > 0 && <span>{animeMovies.length} anime</span>}
                {filmMovies.length > 0 && <span>{filmMovies.length} movies</span>}
              </div>
            )}

            {movies.length > 1 && (
              <div
                className="mt-8 flex items-center gap-1.5"
                aria-label="Featured title navigation"
              >
                {movies.map((movie, index) => (
                  <button
                    key={movie.id}
                    type="button"
                    onClick={() => setFeaturedIndex(index)}
                    aria-label={`Show ${movie.title}`}
                    aria-current={
                      index === featuredIndex ? "true" : undefined
                    }
                    className={`h-1.5 rounded-full transition-all ${
                      index === featuredIndex
                        ? "w-6 bg-red-500"
                        : "w-1.5 bg-zinc-600 hover:bg-zinc-300"
                    }`}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </section>

      {isLoading && (
        <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
          <div className="h-5 w-48 animate-pulse rounded bg-zinc-900" />
          <div className="mt-5 flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 w-40 shrink-0 animate-pulse rounded bg-zinc-950 sm:h-72 sm:w-48"
              />
            ))}
          </div>
        </section>
      )}

      {hasError && (
        <p className="mx-auto max-w-7xl px-6 py-10 text-sm text-red-400 sm:px-10">
          Could not load your library right now.
        </p>
      )}

      {!isLoading && !hasError && (
        <>
          <HomeMovieRow
            title="Pick Up Where You Left Off"
            emptyMessage="Start watching something and your latest unfinished item will appear here."
            items={continueWatchingItems}
            variant="progress"
          />

          {hasMultipleMediaTypes ? (
            <>
              <HomeCatalogRow title="Anime" items={animeMovies} />
              <HomeCatalogRow title="Movies" items={filmMovies} />
            </>
          ) : (
            <HomeCatalogRow
              title={animeMovies.length > 0 ? "Anime" : "Movies"}
              items={movies}
            />
          )}
        </>
      )}
    </>
  );
}
