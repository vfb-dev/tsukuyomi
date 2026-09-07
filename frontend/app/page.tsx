import { MovieCard } from "../components/MovieCard";
import { getMovies } from "../lib/api";

export default async function Home() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-white">
      <h1 className="text-3xl font-bold">Tsukuyomi</h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Movies</h2>

        {movies.length === 0 ? (
          <p className="mt-4 text-gray-400">No movies found.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
