import { Movie } from "@/types/movie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type MovieInput = {
  title: string;
  description: string;
  releaseYear: number;
  durationMinutes: number;
  posterUrl: string;
  videoUrl: string;
  category: string;
};

type GetMoviesParams = {
  search?: string;
  category?: string;
  favorite?: boolean;
};

export async function getMovies(
  params: GetMoviesParams = {},
): Promise<Movie[]> {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.favorite) {
    searchParams.set("favorite", "true");
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `${API_BASE_URL}/api/movies?${queryString}`
    : `${API_BASE_URL}/api/movies`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
}

export async function getMovie(id: number): Promise<Movie | null> {
  const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch movie");
  }

  return response.json();
}

export async function createMovie(movie: MovieInput): Promise<Movie> {
  const response = await fetch(`${API_BASE_URL}/api/movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });

  if (!response.ok) {
    throw new Error("Failed to create movie");
  }

  return response.json();
}

export async function updateMovie(
  id: number,
  movie: MovieInput,
): Promise<Movie> {
  const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });

  if (!response.ok) {
    throw new Error("Failed to update movie");
  }

  return response.json();
}

export async function toggleMovieFavorite(id: number): Promise<Movie> {
  const response = await fetch(`${API_BASE_URL}/api/movies/${id}/favorite`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to toggle movie favorite");
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
