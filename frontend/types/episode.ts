export type Episode = {
  id: number;
  movieId: number;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  durationMinutes: number;
  videoUrl: string;
};

export type EpisodeInput = {
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  durationMinutes: number;
  videoUrl: string;
};
