import type { Movie } from "../types/movie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type GetMoviesOptions = {
  search?: string;
  category?: string;
};

export type CreateMovieInput = {
  title: string;
  description: string;
  releaseYear: number;
  durationMinutes: number;
  posterUrl: string;
  videoUrl: string;
  category: string;
};

export async function getMovies(
  options: GetMoviesOptions = {},
): Promise<Movie[]> {
  const url = new URL(`${API_BASE_URL}/api/movies`);

  if (options.search) {
    url.searchParams.set("search", options.search);
  }

  if (options.category) {
    url.searchParams.set("category", options.category);
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

export async function createMovie(input: CreateMovieInput): Promise<Movie> {
  const response = await fetch(`${API_BASE_URL}/api/movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create movie");
  }

  return response.json();
}

export async function deleteMovie(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete movie");
  }
}
