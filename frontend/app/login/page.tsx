import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto flex max-w-md flex-col">
        <Link href="/" className="text-sm text-red-400 hover:text-red-300">
          Back home
        </Link>

        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Tsukuyomi Admin
          </p>
          <h1 className="mt-3 text-4xl font-bold">Log in</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Access your private admin tools.
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
