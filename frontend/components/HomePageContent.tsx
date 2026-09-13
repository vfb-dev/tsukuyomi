"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  const featuredMovie = movies[0] ?? null;
  const animeMovies = movies.filter((movie) => movie.mediaType === "ANIME");
  const filmMovies = movies.filter((movie) => movie.mediaType !== "ANIME");
  const hasMultipleMediaTypes = animeMovies.length > 0 && filmMovies.length > 0;

  return (
    <>
      <section className="relative isolate min-h-[30rem] overflow-hidden border-b border-zinc-900 bg-black sm:min-h-[34rem]">
        {featuredMovie && (
          <div className="absolute inset-0 z-0">
            <PosterImage
              src={featuredMovie.posterUrl}
              alt=""
              className="h-full w-full object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>
        )}

        <div className="relative z-10 mx-auto flex min-h-[30rem] max-w-7xl items-end px-6 py-12 sm:min-h-[34rem] sm:px-10 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-red-400 uppercase">
              Your personal library
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {featuredMovie?.title ?? "Your next favorite watch"}
            </h1>

            {featuredMovie ? (
              <>
                <p className="mt-4 text-sm font-medium text-zinc-300">
                  {featuredMovie.releaseYear} · {" "}
                  {featuredMovie.mediaType === "ANIME" ? "Anime" : "Movie"} · {" "}
                  {featuredMovie.category}
                </p>

                <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">
                  {featuredMovie.description}
                </p>
              </>
            ) : (
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
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
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-400">
                <span>{movies.length} titles</span>
                {animeMovies.length > 0 && <span>{animeMovies.length} anime</span>}
                {filmMovies.length > 0 && <span>{filmMovies.length} movies</span>}
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
