export const queryKeys = {
  movies: {
    all: ["movies"] as const,
    detail: (id: number) => ["movies", id] as const,
  },
  users: {
    all: ["users"] as const,
  },
} as const;
