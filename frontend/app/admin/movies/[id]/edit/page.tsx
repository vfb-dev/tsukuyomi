import { AdminGuard } from "@/components/AdminGuard";
import { EditMoviePageContent } from "@/components/EditMoviePageContent";
import { Header } from "@/components/Header";

type EditMoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  const { id } = await params;

  return (
    <AdminGuard>
      <main className="min-h-screen bg-black text-white">
        <Header />
        <EditMoviePageContent movieId={Number(id)} />
      </main>
    </AdminGuard>
  );
}
