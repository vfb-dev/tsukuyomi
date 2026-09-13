import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";
import { HomePageContent } from "@/components/HomePageContent";

export default function HomePage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white">
        <Header />
        <HomePageContent />
      </main>
    </AuthGuard>
  );
}
