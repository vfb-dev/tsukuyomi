"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { HomeMovieRow } from "@/components/HomeMovieRow";
import { getCompletedWatching, getContinueWatching } from "@/lib/api";
import { ContinueWatchingItem } from "@/types/watchProgress";

export function HomePageContent() {
  const [continueWatchingItems, setContinueWatchingItems] = useState<
    ContinueWatchingItem[]
  >([]);
  const [completedWatchingItems, setCompletedWatchingItems] = useState<
    ContinueWatchingItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadRows() {
      try {
        const [continueWatching, completedWatching] = await Promise.all([
          getContinueWatching(),
          getCompletedWatching(),
        ]);

        setContinueWatchingItems(continueWatching);
        setCompletedWatchingItems(completedWatching);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadRows();
  }, []);

  return (
    <>
      <section className="px-8 py-12">
        <h1 className="text-4xl font-bold">Tsukuyomi</h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Your personal streaming library.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/movies"
            className="rounded bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500"
          >
            Browse catalog
          </Link>

          <Link
            href="/admin/movies"
            className="rounded border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:border-zinc-500"
          >
            Admin
          </Link>
        </div>
      </section>

      {isLoading && (
        <p className="px-8 pb-12 text-sm text-zinc-500">Loading catalog...</p>
      )}

      {hasError && (
        <p className="px-8 pb-12 text-sm text-red-400">
          Could not load your watch history.
        </p>
      )}

      {!isLoading && !hasError && (
        <>
          <HomeMovieRow
            title="Continue Watching"
            emptyMessage="Start watching an item and it will appear here."
            items={continueWatchingItems}
            variant="progress"
          />

          <HomeMovieRow
            title="Completed"
            emptyMessage="Completed items will appear here."
            items={completedWatchingItems}
            variant="completed"
          />
        </>
      )}
    </>
  );
}
