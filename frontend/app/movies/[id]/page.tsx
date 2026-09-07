import { getMovie } from "@/lib/api";

type MoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = await getMovie(id);

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-white">
      <a href="/" className="text-sm text-gray-400 hover:text-white">
        Back to movies
      </a>

      <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <video
            src={movie.videoUrl}
            controls
            className="aspect-video w-full rounded bg-zinc-900"
          />

          <h1 className="mt-6 text-4xl font-bold">{movie.title}</h1>
          <p className="mt-3 text-gray-400">
            {movie.releaseYear} • {movie.durationMinutes} min
          </p>
          <p className="mt-6 max-w-3xl text-gray-200">{movie.description}</p>
        </div>

        <aside className="hidden lg:block">
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className="w-full rounded border border-gray-800 object-cover"
          />
        </aside>
      </section>
    </main>
  );
}
