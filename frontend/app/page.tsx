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
          <ul className="mt-4 space-y-3">
            {movies.map((movie) => (
              <li key={movie.id} className="rounded border border-gray-800 p-4">
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-400">
                  {movie.releaseYear} • {movie.durationMinutes} min
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
