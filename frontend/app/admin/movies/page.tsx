import Link from "next/link";

import { CreateMovieForm } from "../../../components/CreateMovieForm";
import { DeleteMovieButton } from "../../../components/DeleteMovieButton";
import { Header } from "../../../components/Header";
import { getMovies } from "../../../lib/api";

export default async function AdminMoviesPage() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="px-8 py-10">
        <h1 className="text-3xl font-bold">Admin Movies</h1>
        <p className="mt-2 text-sm text-gray-400">
          Create and manage movies in your catalog.
        </p>

        <CreateMovieForm />

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Existing Movies</h2>

          {movies.length === 0 ? (
            <p className="mt-4 text-gray-400">No movies created yet.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded border border-gray-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Year</th>
                    <th className="px-4 py-3 font-medium">Duration</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800">
                  {movies.map((movie) => (
                    <tr key={movie.id} className="bg-black">
                      <td className="px-4 py-3 font-medium text-white">
                        {movie.title}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {movie.category}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {movie.releaseYear}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {movie.durationMinutes} min
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/movies/${movie.id}/edit`}
                            className="text-sm font-medium text-gray-300 hover:text-white"
                          >
                            Edit
                          </Link>

                          <DeleteMovieButton movieId={movie.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
