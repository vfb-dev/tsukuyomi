"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Film, Search, SearchX, SlidersHorizontal, Tv, X } from "lucide-react";

import { MovieCard } from "@/components/MovieCard";
import { getMovies } from "@/lib/api";
import { Movie } from "@/types/movie";

type MediaTypeFilter = "ALL" | "MOVIE" | "ANIME";

export function CatalogPageContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] =
    useState<MediaTypeFilter>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadMovies = useCallback(
    async function loadMovies(
      nextSearch = activeSearch,
      nextCategory = activeCategory,
    ) {
      try {
        setIsLoading(true);
        setHasError(false);

        const loadedMovies = await getMovies({
          search: nextSearch,
          category: nextCategory,
        });

        setMovies(loadedMovies);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [activeCategory, activeSearch],
  );

  useEffect(() => {
    async function loadInitialMovies() {
      try {
        const loadedMovies = await getMovies();
        const uniqueCategories = Array.from(
          new Set(loadedMovies.map((movie) => movie.category)),
        ).sort((first, second) => first.localeCompare(second));

        setMovies(loadedMovies);
        setCategories(uniqueCategories);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialMovies();
  }, []);

  useEffect(() => {
    const nextSearch = search.trim();

    if (nextSearch === activeSearch) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveSearch(nextSearch);
      void loadMovies(nextSearch, activeCategory);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [activeCategory, activeSearch, loadMovies, search]);

  function handleCategoryChange(nextCategory: string) {
    setActiveCategory(nextCategory);
    void loadMovies(activeSearch, nextCategory);
  }

  function handleClear() {
    setSearch("");
    setActiveSearch("");
    setActiveCategory("");
    setMediaTypeFilter("ALL");
    setIsFilterOpen(false);
    void loadMovies("", "");
  }

  const visibleMovies = useMemo(() => {
    if (mediaTypeFilter === "ALL") {
      return movies;
    }

    return movies.filter((movie) => movie.mediaType === mediaTypeFilter);
  }, [mediaTypeFilter, movies]);

  const hasFilters = Boolean(
    activeSearch || activeCategory || mediaTypeFilter !== "ALL",
  );
  const activeFilterCount =
    Number(mediaTypeFilter !== "ALL") + Number(Boolean(activeCategory));

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <div className="flex flex-col gap-8 border-b border-zinc-900 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Catalog
            </h1>
            {!isLoading && !hasError && (
              <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs font-semibold text-zinc-400">
                {movies.length} {movies.length === 1 ? "title" : "titles"}
              </span>
            )}
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Find your next movie or anime, then pick up exactly where you left
            off.
          </p>
        </div>

        <div className="flex w-full max-w-xl items-start gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search movies and anime"
              aria-label="Search movies and anime"
              className="h-11 w-full rounded border border-zinc-800 bg-zinc-950 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-600"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search field"
                title="Clear search field"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
              aria-expanded={isFilterOpen}
              aria-controls="catalog-filters"
              title="Open filters"
              className={`inline-flex h-11 items-center gap-2 rounded border px-3 text-sm font-semibold transition ${
                isFilterOpen || activeFilterCount > 0
                  ? "border-red-500/60 bg-red-600/10 text-red-300"
                  : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600 hover:text-white"
              }`}
            >
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {isFilterOpen && (
              <div
                id="catalog-filters"
                role="dialog"
                aria-label="Catalog filters"
                className="absolute right-0 top-full z-30 mt-2 w-80 max-w-[calc(100vw-3rem)] rounded border border-zinc-800 bg-zinc-950 p-4 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Filters
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      Narrow your catalog
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    aria-label="Close filters"
                    title="Close filters"
                    className="flex h-8 w-8 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Type
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaTypeFilter("ALL")}
                      className={`rounded border px-2 py-2 text-xs font-semibold transition ${
                        mediaTypeFilter === "ALL"
                          ? "border-white/30 bg-white text-black"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTypeFilter("MOVIE")}
                      className={`inline-flex items-center justify-center gap-1.5 rounded border px-2 py-2 text-xs font-semibold transition ${
                        mediaTypeFilter === "MOVIE"
                          ? "border-white/30 bg-white text-black"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      <Film aria-hidden="true" className="h-3.5 w-3.5" />
                      Movies
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTypeFilter("ANIME")}
                      className={`inline-flex items-center justify-center gap-1.5 rounded border px-2 py-2 text-xs font-semibold transition ${
                        mediaTypeFilter === "ANIME"
                          ? "border-white/30 bg-white text-black"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      <Tv aria-hidden="true" className="h-3.5 w-3.5" />
                      Anime
                    </button>
                  </div>
                </div>

                {categories.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Genre
                    </p>
                    <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
                      <button
                        type="button"
                        onClick={() => handleCategoryChange("")}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          activeCategory === ""
                            ? "border-red-500/50 bg-red-600/15 text-red-300"
                            : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-200"
                        }`}
                      >
                        All genres
                      </button>
                      {categories.map((itemCategory) => (
                        <button
                          key={itemCategory}
                          type="button"
                          onClick={() => handleCategoryChange(itemCategory)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                            activeCategory === itemCategory
                              ? "border-red-500/50 bg-red-600/15 text-red-300"
                              : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-200"
                          }`}
                        >
                          {itemCategory}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hasFilters && (
                  <div className="mt-5 border-t border-zinc-900 pt-4">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-xs font-semibold text-zinc-500 transition hover:text-white"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded border border-zinc-900 bg-zinc-950"
            >
              <div className="aspect-[2/3] animate-pulse bg-zinc-900" />
              <div className="space-y-3 p-4">
                <div className="h-4 animate-pulse rounded bg-zinc-900" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-900" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasError && (
        <div className="mt-10 flex flex-col items-center border-y border-zinc-900 py-16 text-center">
          <SearchX aria-hidden="true" className="h-8 w-8 text-zinc-700" />
          <p className="mt-4 text-sm text-red-400">Could not load catalog.</p>
          <button
            type="button"
            onClick={() => void loadMovies()}
            className="mt-4 text-xs font-semibold text-zinc-400 underline decoration-zinc-700 underline-offset-4 transition hover:text-white"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !hasError && visibleMovies.length === 0 && (
        <div className="mt-10 flex flex-col items-center border-y border-zinc-900 py-16 text-center">
          <SearchX aria-hidden="true" className="h-8 w-8 text-zinc-700" />
          <h2 className="mt-4 text-lg font-semibold text-white">
            No titles found
          </h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            Try a different search or clear the filters to browse the full
            catalog.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="mt-5 inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      )}

      {!isLoading && !hasError && visibleMovies.length > 0 && (
        <>
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-xs font-medium text-zinc-500">
              {visibleMovies.length}{" "}
              {visibleMovies.length === 1 ? "result" : "results"}
              {activeSearch && (
                <>
                  {" "}
                  for <span className="text-zinc-300">“{activeSearch}”</span>
                </>
              )}
            </p>
          </div>

          <div className="mt-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {visibleMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
