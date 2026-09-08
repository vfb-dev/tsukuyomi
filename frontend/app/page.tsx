import { Header } from "../components/Header";
import { MovieCard } from "../components/MovieCard";
import { getMovies } from "../lib/api";

type HomeProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { search } = await searchParams;
  const movies = await getMovies(search);

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="px-8 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Movies</h1>
            <p className="mt-2 text-sm text-gray-400">
              Browse your personal catalog.
            </p>
          </div>

          <form className="flex gap-2">
            <input
              type="search"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search movies"
              className="w-64 rounded border border-gray-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-600"
            />
            <button
              type="submit"
              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Search
            </button>
          </form>
        </div>

        {movies.length === 0 ? (
          <p className="mt-8 text-gray-400">No movies found.</p>
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
