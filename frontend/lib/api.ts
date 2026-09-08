import type { Movie } from "../types/movie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function getMovies(search?: string): Promise<Movie[]> {
  const url = new URL(`${API_BASE_URL}/api/movies`);

  if (search) {
    url.searchParams.set("search", search);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
}

export async function getMovie(id: string): Promise<Movie> {
  const response = await fetch(`${API_BASE_URL}/api/movies/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movie");
  }

  return response.json();
}
