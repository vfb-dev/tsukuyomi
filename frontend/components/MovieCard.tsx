import Link from "next/link";
import { Heart } from "lucide-react";

import { PosterImage } from "@/components/PosterImage";
import { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group overflow-hidden rounded border border-zinc-900 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        <PosterImage
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
        />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span
            className={`rounded px-2 py-1 text-[10px] font-semibold tracking-wide uppercase shadow-sm ${
              movie.mediaType === "ANIME"
                ? "border border-red-300/40 bg-red-600/85 text-white"
                : "border border-white/20 bg-black/75 text-zinc-200"
            }`}
          >
            {movie.mediaType === "ANIME" ? "Anime" : "Movie"}
          </span>

          {movie.favorite && (
            <span
              title="Favorite"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-yellow-200/40 bg-yellow-500/90 text-black shadow-sm"
            >
              <Heart
                aria-hidden="true"
                className="h-3.5 w-3.5 fill-current"
              />
              <span className="sr-only">Favorite</span>
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h2 className="truncate font-semibold text-white">{movie.title}</h2>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
          <span>{movie.releaseYear}</span>
          <span aria-hidden="true" className="text-zinc-700">
            •
          </span>
          <span>{movie.category}</span>
          <span aria-hidden="true" className="text-zinc-700">
            •
          </span>
          <span>{movie.durationMinutes} min</span>
        </div>
      </div>
    </Link>
  );
}
