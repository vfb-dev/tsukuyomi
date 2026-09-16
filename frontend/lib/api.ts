import {
  AppUser,
  AppUserInput,
  AuthUser,
  LoginInput,
} from "@/types/auth";
import { Episode, EpisodeInput } from "@/types/episode";
import { Movie, MovieInput } from "@/types/movie";
import {
  ContinueWatchingItem,
  EpisodeWatchProgress,
  WatchProgress,
  WatchProgressInput,
} from "@/types/watchProgress";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type CsrfResponse = {
  token: string;
};

let csrfToken: string | null = null;

async function loadCsrfToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load CSRF token.");
  }

  const body = (await response.json()) as CsrfResponse;
  csrfToken = body.token;

  return csrfToken;
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const method = String(options.method ?? "GET").toUpperCase();
  const unsafeMethods = ["POST", "PUT", "PATCH", "DELETE"];

  async function sendRequest(): Promise<Response> {
    const headers = new Headers(options.headers);

    if (unsafeMethods.includes(method)) {
      const token = csrfToken ?? await loadCsrfToken();
      headers.set("X-XSRF-TOKEN", token);
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  }

  let response = await sendRequest();

  if (unsafeMethods.includes(method) && response.status === 403) {
    csrfToken = null;
    response = await sendRequest();
  }

  return response;
}

async function getErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const body = (await response.json()) as unknown;

    if (body && typeof body === "object") {
      const errorBody = body as Record<string, unknown>;
      const detail = errorBody.detail;
      const message = errorBody.message;
      const error = errorBody.error;

      if (typeof detail === "string" && detail) {
        return detail;
      }

      if (typeof message === "string" && message) {
        return message;
      }

      if (typeof error === "string" && error) {
        return error;
      }
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

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

  const response = await apiFetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
}

export async function getMovie(id: number): Promise<Movie | null> {
  const response = await apiFetch(`${API_BASE_URL}/api/movies/${id}`, {
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
  const response = await apiFetch(`${API_BASE_URL}/api/movies`, {
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
  const response = await apiFetch(`${API_BASE_URL}/api/movies/${id}`, {
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
  const response = await apiFetch(`${API_BASE_URL}/api/movies/${id}/favorite`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to toggle movie favorite");
  }

  return response.json();
}

export async function deleteMovie(id: number): Promise<void> {
  const response = await apiFetch(`${API_BASE_URL}/api/movies/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete movie");
  }
}

export async function getEpisodes(movieId: number): Promise<Episode[]> {
  const response = await apiFetch(`${API_BASE_URL}/api/movies/${movieId}/episodes`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch episodes");
  }

  return response.json();
}

export async function getEpisode(
  movieId: number,
  episodeId: number,
): Promise<Episode> {
  const response = await apiFetch(
    `${API_BASE_URL}/api/movies/${movieId}/episodes/${episodeId}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch episode");
  }

  return response.json();
}

export async function createEpisode(
  movieId: number,
  episode: EpisodeInput,
): Promise<Episode> {
  const response = await apiFetch(`${API_BASE_URL}/api/movies/${movieId}/episodes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(episode),
  });

  if (!response.ok) {
    throw new Error("Failed to create episode");
  }

  return response.json();
}

export async function updateEpisode(
  movieId: number,
  episodeId: number,
  episode: EpisodeInput,
): Promise<Episode> {
  const response = await apiFetch(
    `${API_BASE_URL}/api/movies/${movieId}/episodes/${episodeId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(episode),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update episode");
  }

  return response.json();
}

export async function deleteEpisode(
  movieId: number,
  episodeId: number,
): Promise<void> {
  const response = await apiFetch(
    `${API_BASE_URL}/api/movies/${movieId}/episodes/${episodeId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete episode");
  }
}

export async function getEpisodeWatchProgress(
  movieId: number,
  episodeId: number,
): Promise<EpisodeWatchProgress> {
  const response = await apiFetch(
    `${API_BASE_URL}/api/movies/${movieId}/episodes/${episodeId}/progress`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch episode watch progress");
  }

  return response.json();
}

export async function getWatchProgress(
  movieId: number,
): Promise<WatchProgress> {
  const response = await apiFetch(
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
  const response = await apiFetch(`${API_BASE_URL}/api/watch-progress/continue`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch continue watching");
  }

  return response.json();
}

export async function getCompletedWatching(): Promise<ContinueWatchingItem[]> {
  const response = await apiFetch(`${API_BASE_URL}/api/watch-progress/completed`, {
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
  const response = await apiFetch(
    `${API_BASE_URL}/api/movies/${movieId}/progress`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progress),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to save watch progress");
  }

  return response.json();
}

export async function saveEpisodeWatchProgress(
  movieId: number,
  episodeId: number,
  progress: WatchProgressInput,
): Promise<EpisodeWatchProgress> {
  const response = await apiFetch(
    `${API_BASE_URL}/api/movies/${movieId}/episodes/${episodeId}/progress`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progress),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to save episode watch progress");
  }

  return response.json();
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const response = await apiFetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password.");
  }

  csrfToken = null;

  return response.json();
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiFetch(`${API_BASE_URL}/api/auth/me`);

  if (!response.ok) {
    throw new Error("Could not load current user.");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Could not log out.");
    }
  } finally {
    csrfToken = null;
  }
}

export async function getUsers(): Promise<AppUser[]> {
  const response = await apiFetch(`${API_BASE_URL}/api/users`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function createUser(user: AppUserInput): Promise<AppUser> {
  const response = await apiFetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to create user"));
  }

  return response.json();
}

export async function deleteUser(id: number): Promise<void> {
  const response = await apiFetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to delete user"));
  }
}
