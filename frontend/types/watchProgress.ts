import { Movie } from "@/types/movie";

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

export type EpisodeWatchProgress = {
  id: number | null;
  episodeId: number;
  progressSeconds: number;
  completed: boolean;
};

export type ContinueWatchingItem = {
  movie: Movie;
  progress: WatchProgress;
};
