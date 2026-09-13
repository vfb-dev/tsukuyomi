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
    <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
      <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>

      {items.length === 0 ? (
        <div className="mt-5 border-y border-zinc-900 py-5">
          <p className="text-sm text-zinc-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-5 grid auto-cols-[13.5rem] grid-flow-col gap-4 overflow-x-auto pb-2 sm:auto-cols-[17rem] sm:gap-5">
          {items.map(({ movie, episode, progress }) => {
            const progressMinutes = Math.floor(progress.progressSeconds / 60);
            const itemSubtitle = episode
              ? `S${episode.seasonNumber} E${episode.episodeNumber}: ${episode.title}`
              : null;
            const itemHref = episode
              ? `/movies/${movie.id}?episode=${episode.id}`
              : `/movies/${movie.id}`;
            const itemKey = episode
              ? `${movie.id}-episode-${episode.id}`
              : `${movie.id}-movie`;
            const totalSeconds = episode
              ? episode.durationMinutes * 60
              : movie.durationMinutes * 60;
            const progressPercent = totalSeconds
              ? Math.min(
                  100,
                  Math.round((progress.progressSeconds / totalSeconds) * 100),
                )
              : 0;

            return (
              <Link
                key={itemKey}
                href={itemHref}
                className="group min-w-0 snap-start overflow-hidden rounded border border-zinc-900 bg-zinc-950 transition duration-200 hover:-translate-y-1 hover:border-zinc-700"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
                  <PosterImage
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-1 bg-zinc-800/90">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {movie.title}
                  </h3>

                  {itemSubtitle && (
                    <p className="mt-1 truncate text-xs text-zinc-400">
                      {itemSubtitle}
                    </p>
                  )}

                  <p
                    className={`mt-2 text-xs ${
                      variant === "progress" ? "text-zinc-500" : "text-green-500"
                    }`}
                  >
                    {variant === "progress"
                      ? `${progressMinutes} min watched`
                      : "Completed"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
