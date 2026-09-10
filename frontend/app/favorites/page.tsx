import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { getMovies } from "@/lib/api";

export default async function FavoritesPage() {
  const movies = await getMovies({ favorite: true });

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="px-8 py-10">
        <h1 className="text-3xl font-bold">Favorites</h1>

        <p className="mt-2 text-sm text-gray-400">
          Movies you marked as favorites.
        </p>

        {movies.length === 0 ? (
          <p className="mt-8 text-gray-400">No favorite movies yet.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
