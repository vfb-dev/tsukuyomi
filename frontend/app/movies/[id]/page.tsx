import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";
import { MovieDetailsPageContent } from "@/components/MovieDetailsPageContent";

type MovieDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MovieDetailsPage({
  params,
}: MovieDetailsPageProps) {
  const { id } = await params;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white">
        <Header />
        <MovieDetailsPageContent movieId={Number(id)} />
      </main>
    </AuthGuard>
  );
}
