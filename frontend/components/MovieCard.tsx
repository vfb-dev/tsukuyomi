import type { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <a
      href={`/movies/${movie.id}`}
      className="block overflow-hidden rounded border border-gray-800 bg-zinc-950 transition hover:scale-[1.02] hover:border-gray-600"
    >
      <div className="aspect-[2/3] bg-zinc-900">
        <img
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <span className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
          {movie.category}
        </span>

        <h3 className="mt-3 font-semibold">{movie.title}</h3>
        <p className="mt-1 text-sm text-gray-400">
          {movie.releaseYear} • {movie.durationMinutes} min
        </p>
        <p className="mt-3 line-clamp-2 text-sm text-gray-300">
          {movie.description}
        </p>
      </div>
    </a>
  );
}
