import Link from "next/link";
import { notFound } from "next/navigation";

import { FavoriteButton } from "@/components/FavoriteButton";
import { Header } from "@/components/Header";
import { getMovie } from "@/lib/api";

type MoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = await getMovie(Number(id));

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="px-8 py-10">
        <Link href="/movies" className="text-sm text-gray-400 hover:text-white">
          Back to movies
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <video
              src={movie.videoUrl}
              controls
              className="aspect-video w-full rounded bg-zinc-900"
            />

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                  {movie.category}
                </span>

                {movie.favorite && (
                  <span className="rounded border border-yellow-500/50 px-2 py-1 text-xs font-semibold text-yellow-300">
                    Favorite
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-4xl font-bold">{movie.title}</h1>
              <p className="mt-3 text-gray-400">
                {movie.releaseYear} • {movie.durationMinutes} min
              </p>
              <p className="mt-6 max-w-3xl text-gray-200">
                {movie.description}
              </p>

              <div className="mt-6">
                <FavoriteButton
                  movieId={movie.id}
                  initialFavorite={movie.favorite}
                />
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <img
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              className="w-full rounded border border-gray-800 object-cover"
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
