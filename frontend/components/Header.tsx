export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-900 px-8 py-5">
      <a href="/" className="text-2xl font-bold tracking-wide text-red-600">
        Tsukuyomi
      </a>

      <nav className="flex items-center gap-6 text-sm text-gray-400">
        <a href="/" className="hover:text-white">
          Home
        </a>
        <a href="/" className="hover:text-white">
          Movies
        </a>
      </nav>
    </header>
  );
}
