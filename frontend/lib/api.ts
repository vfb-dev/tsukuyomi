import type { Movie } from "../types/movie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/api/movies`);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
}
