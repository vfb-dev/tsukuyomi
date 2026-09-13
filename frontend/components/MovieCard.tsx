import Link from "next/link";

import { PosterImage } from "@/components/PosterImage";
import { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group overflow-hidden rounded border border-zinc-900 bg-zinc-950 hover:border-zinc-700"
    >
      <PosterImage
        src={movie.posterUrl}
        alt={movie.title}
        className="aspect-[2/3] w-full object-cover transition group-hover:scale-105"
      />

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-white">{movie.title}</h2>

          {movie.favorite && (
            <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-semibold text-black">
              Favorite
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-zinc-500">
          {movie.releaseYear} •{" "}
          {movie.mediaType === "ANIME" ? "Anime" : "Movie"} • {movie.category}
        </p>
      </div>
    </Link>
  );
}
