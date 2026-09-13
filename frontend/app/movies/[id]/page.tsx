import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";
import { MovieDetailsPageContent } from "@/components/MovieDetailsPageContent";

type MovieDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    episode?: string;
  }>;
};

export default async function MovieDetailsPage({
  params,
  searchParams,
}: MovieDetailsPageProps) {
  const { id } = await params;
  const { episode } = searchParams ? await searchParams : {};
  const parsedEpisodeId = episode ? Number(episode) : null;
  const initialEpisodeId =
    parsedEpisodeId && Number.isFinite(parsedEpisodeId) ? parsedEpisodeId : null;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white">
        <Header />
        <MovieDetailsPageContent
          movieId={Number(id)}
          initialEpisodeId={initialEpisodeId}
        />
      </main>
    </AuthGuard>
  );
}
