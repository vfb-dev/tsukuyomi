import Link from "next/link";
import { notFound } from "next/navigation";

import { EditMovieForm } from "@/components/EditMovieForm";
import { Header } from "@/components/Header";
import { getMovie } from "@/lib/api";
import { AdminGuard } from "@/components/AdminGuard";

type EditMoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  const { id } = await params;
  const movie = await getMovie(Number(id));

  if (!movie) {
    notFound();
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-black text-white">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-8">
            <Link
              href="/admin/movies"
              className="text-sm text-red-400 hover:text-red-300"
            >
              Back to admin
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-white">Edit movie</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Update the catalog information for {movie.title}.
            </p>
          </div>

          <EditMovieForm movie={movie} />
        </section>
      </main>
    </AdminGuard>
  );
}
