import { AuthGuard } from "@/components/AuthGuard";
import { CatalogPageContent } from "@/components/CatalogPageContent";
import { Header } from "@/components/Header";

export default function MoviesPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white">
        <Header />
        <CatalogPageContent />
      </main>
    </AuthGuard>
  );
}
