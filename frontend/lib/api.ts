import { getAuthToken } from "@/lib/auth";
import { AuthUser, LoginInput, LoginResponse } from "@/types/auth";
import { Movie } from "@/types/movie";
import {
  ContinueWatchingItem,
  WatchProgress,
  WatchProgressInput,
} from "@/types/watchProgress";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

function getAuthHeaders() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("You must be logged in.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to toggle movie favorite");
  }

  return response.json();
}

export async function deleteMovie(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete movie");
  }
}

export async function getWatchProgress(
  movieId: number,
): Promise<WatchProgress> {
  const response = await fetch(
    `${API_BASE_URL}/api/movies/${movieId}/progress`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch watch progress");
  }

  return response.json();
}

export async function getContinueWatching(): Promise<ContinueWatchingItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/watch-progress/continue`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch continue watching");
  }

  return response.json();
}

export async function getCompletedWatching(): Promise<ContinueWatchingItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/watch-progress/completed`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch completed watching");
  }

  return response.json();
}

export async function saveWatchProgress(
  movieId: number,
  progress: WatchProgressInput,
): Promise<WatchProgress> {
  const response = await fetch(
    `${API_BASE_URL}/api/movies/${movieId}/progress`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(progress),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to save watch progress");
  }

  return response.json();
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password.");
  }

  return response.json();
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not load current user.");
  }

  return response.json();
}
