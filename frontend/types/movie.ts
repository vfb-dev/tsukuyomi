export type Movie = {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  durationMinutes: number;
  posterUrl: string;
  videoUrl: string;
  category: string;
  mediaType: string;
  favorite: boolean | null;
};

export type MovieInput = {
  title: string;
  description: string;
  releaseYear: number;
  durationMinutes: number;
  posterUrl: string;
  videoUrl: string;
  category: string;
  mediaType: string;
};
