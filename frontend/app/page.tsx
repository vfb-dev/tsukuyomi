import Link from "next/link";

import { Header } from "@/components/Header";
import { getContinueWatching, getMovie } from "@/lib/api";

export default async function HomePage() {
  const progressList = await getContinueWatching();

  const continueWatchingMovies = (
    await Promise.all(
      progressList.map(async (progress) => {
        const movie = await getMovie(progress.movieId);

        if (!movie) {
          return null;
        }

        return {
          movie,
          progress,
        };
      }),
    )
  ).filter((item) => item !== null);

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

      <section className="px-8 pb-12">
        <h2 className="text-2xl font-bold">Continue Watching</h2>

        {continueWatchingMovies.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            Start watching a movie and it will appear here.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {continueWatchingMovies.map(({ movie, progress }) => {
              const progressMinutes = Math.floor(progress.progressSeconds / 60);

              return (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="group overflow-hidden rounded border border-zinc-900 bg-zinc-950 hover:border-zinc-700"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="aspect-[2/3] w-full object-cover transition group-hover:scale-105"
                  />

                  <div className="p-4">
                    <h3 className="font-semibold text-white">{movie.title}</h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {progressMinutes} min watched
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
