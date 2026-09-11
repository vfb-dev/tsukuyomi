import Link from "next/link";

import { Header } from "@/components/Header";
import { HomeMovieRow } from "@/components/HomeMovieRow";
import { getCompletedWatching, getContinueWatching } from "@/lib/api";

export default async function HomePage() {
  const continueWatchingItems = await getContinueWatching();
  const completedWatchingItems = await getCompletedWatching();

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

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
            Browse movies
          </Link>

          <Link
            href="/admin/movies"
            className="rounded border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:border-zinc-500"
          >
            Admin
          </Link>
        </div>
      </section>

      <HomeMovieRow
        title="Continue Watching"
        emptyMessage="Start watching a movie and it will appear here."
        items={continueWatchingItems}
        variant="progress"
      />

      <HomeMovieRow
        title="Completed"
        emptyMessage="Completed movies will appear here."
        items={completedWatchingItems}
        variant="completed"
      />
    </main>
  );
}
