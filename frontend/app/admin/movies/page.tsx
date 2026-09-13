import { AdminCatalogPageContent } from "@/components/AdminCatalogPageContent";
import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";

export default function AdminMoviesPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white">
        <Header />
        <AdminCatalogPageContent />
      </main>
    </AuthGuard>
  );
}
