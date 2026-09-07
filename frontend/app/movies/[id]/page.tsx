import type { Movie } from "../../../types/movie";

type MoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getMovie(id: string): Promise<Movie> {
  const response = await fetch(`http://localhost:8080/api/movies/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movie");
  }

  return response.json();
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = await getMovie(id);

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-white">
      <a href="/" className="text-sm text-gray-400 hover:text-white">
        Back to movies
      </a>

      <section className="mt-8 grid gap-8 md:grid-cols-[260px_1fr]">
        <div className="overflow-hidden rounded border border-gray-800 bg-zinc-900">
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="mt-3 text-gray-400">
            {movie.releaseYear} • {movie.durationMinutes} min
          </p>
          <p className="mt-6 max-w-2xl text-gray-200">{movie.description}</p>
        </div>
      </section>
    </main>
  );
}
