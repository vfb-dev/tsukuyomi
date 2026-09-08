import { Header } from "../../../components/Header";
import { CreateMovieForm } from "../../../components/CreateMovieForm";

export default function AdminMoviesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="px-8 py-10">
        <h1 className="text-3xl font-bold">Admin Movies</h1>
        <p className="mt-2 text-sm text-gray-400">
          Create and manage movies in your catalog.
        </p>

        <CreateMovieForm />
      </section>
    </main>
  );
}
