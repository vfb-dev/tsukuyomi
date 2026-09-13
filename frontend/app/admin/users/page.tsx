import { AdminGuard } from "@/components/AdminGuard";
import { AdminUsersPageContent } from "@/components/AdminUsersPageContent";
import { Header } from "@/components/Header";

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-black text-white">
        <Header />
        <AdminUsersPageContent />
      </main>
    </AdminGuard>
  );
}
