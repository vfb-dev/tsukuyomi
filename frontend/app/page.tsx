import { Header } from "../components/Header";
import { MovieCard } from "../components/MovieCard";
import { getMovies } from "../lib/api";

export default async function Home() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="px-8 py-10">
        <h1 className="text-3xl font-bold">Movies</h1>

        {movies.length === 0 ? (
          <p className="mt-4 text-gray-400">No movies found.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
