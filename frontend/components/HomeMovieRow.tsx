import Link from "next/link";

import { ContinueWatchingItem } from "@/types/watchProgress";

import { PosterImage } from "@/components/PosterImage";

type HomeMovieRowProps = {
  title: string;
  emptyMessage: string;
  items: ContinueWatchingItem[];
  variant: "progress" | "completed";
};

export function HomeMovieRow({
  title,
  emptyMessage,
  items,
  variant,
}: HomeMovieRowProps) {
  return (
    <section className="px-8 pb-12">
      <h2 className="text-2xl font-bold">{title}</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{emptyMessage}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ movie, progress }) => {
            const progressMinutes = Math.floor(progress.progressSeconds / 60);
            const posterOpacity =
              variant === "completed"
                ? "opacity-80 group-hover:opacity-100"
                : "";

            return (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="group overflow-hidden rounded border border-zinc-900 bg-zinc-950 hover:border-zinc-700"
              >
                <PosterImage
                  src={movie.posterUrl}
                  alt={movie.title}
                  className={`aspect-[2/3] w-full object-cover transition group-hover:scale-105 ${posterOpacity}`}
                />

                <div className="p-4">
                  <h3 className="font-semibold text-white">{movie.title}</h3>

                  {variant === "progress" ? (
                    <p className="mt-1 text-sm text-zinc-500">
                      {progressMinutes} min watched
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-green-500">Completed</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
