import Link from "next/link";
import { notFound } from "next/navigation";

import { FavoriteButton } from "@/components/FavoriteButton";
import { Header } from "@/components/Header";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getMovie, getWatchProgress } from "@/lib/api";

type MovieDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MovieDetailsPage({
  params,
}: MovieDetailsPageProps) {
  const { id } = await params;
  const movie = await getMovie(Number(id));

  if (!movie) {
    notFound();
  }

  const progress = await getWatchProgress(movie.id);
  const progressMinutes = Math.floor(progress.progressSeconds / 60);

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="mx-auto max-w-5xl px-8 py-10">
        <Link
          href="/movies"
          className="text-sm text-red-400 hover:text-red-300"
        >
          Back to movies
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="aspect-[2/3] w-full rounded object-cover"
          />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
                {movie.category}
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
    </main>
  );
}
