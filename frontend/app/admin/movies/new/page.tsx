import { AdminGuard } from "@/components/AdminGuard";
import { CreateMoviePageContent } from "@/components/CreateMoviePageContent";
import { Header } from "@/components/Header";

export default function CreateMoviePage() {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-black text-white">
        <Header />
        <CreateMoviePageContent />
      </main>
    </AdminGuard>
  );
}
