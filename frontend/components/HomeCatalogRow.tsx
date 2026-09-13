import Link from "next/link";

import { PosterImage } from "@/components/PosterImage";
import { Movie } from "@/types/movie";

type HomeCatalogRowProps = {
  title: string;
  items: Movie[];
};

export function HomeCatalogRow({ title, items }: HomeCatalogRowProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-10 sm:px-10">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>

        <Link
          href="/movies"
          className="text-xs font-semibold text-zinc-500 transition hover:text-white"
        >
          See all
        </Link>
      </div>

      <div className="mt-5 grid auto-cols-[9.5rem] grid-flow-col gap-4 overflow-x-auto pb-2 sm:auto-cols-[12rem] sm:gap-5">
        {items.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className="group min-w-0 snap-start overflow-hidden rounded border border-zinc-900 bg-zinc-950 transition duration-200 hover:-translate-y-1 hover:border-zinc-700"
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
              <PosterImage
                src={movie.posterUrl}
                alt={movie.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <span className="absolute left-2 top-2 rounded bg-black/75 px-2 py-1 text-[10px] font-semibold tracking-wide text-zinc-200 uppercase">
                {movie.mediaType === "ANIME" ? "Anime" : "Movie"}
              </span>
            </div>

            <div className="p-3">
              <h3 className="truncate text-sm font-semibold text-white">{movie.title}</h3>
              <p className="mt-1 truncate text-xs text-zinc-500">
                {movie.releaseYear} · {movie.category}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
