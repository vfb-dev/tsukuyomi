export type WatchProgress = {
  id: number | null;
  movieId: number;
  progressSeconds: number;
  completed: boolean;
};

export type WatchProgressInput = {
  progressSeconds: number;
  completed: boolean;
};
