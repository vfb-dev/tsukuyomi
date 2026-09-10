import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-900 bg-black px-8 py-4 text-white">
      <nav className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-red-600">
          Tsukuyomi
        </Link>

        <div className="flex items-center gap-5 text-sm text-gray-300">
          <Link href="/movies" className="hover:text-white">
            Movies
          </Link>

          <Link href="/favorites" className="hover:text-white">
            Favorites
          </Link>

          <Link href="/admin/movies" className="hover:text-white">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
