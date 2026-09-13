import { AuthGuard } from "@/components/AuthGuard";
import { FavoritesPageContent } from "@/components/FavoritesPageContent";
import { Header } from "@/components/Header";

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white">
        <Header />
        <FavoritesPageContent />
      </main>
    </AuthGuard>
  );
}
