import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-900 px-8 py-5">
      <Link href="/" className="text-2xl font-bold tracking-wide text-red-600">
        Tsukuyomi
      </Link>

      <nav className="flex items-center gap-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-white">
          Home
        </Link>

        <Link href="/" className="hover:text-white">
          Movies
        </Link>

        <Link href="/admin/movies" className="hover:text-white">
          Admin
        </Link>
      </nav>
    </header>
  );
}
