import { MovieInput } from "@/types/movie";

export function getMovieInputFromFormData(formData: FormData): MovieInput {
  const mediaType = String(formData.get("mediaType") || "MOVIE");

  return {
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    releaseYear: Number(formData.get("releaseYear")),
    durationMinutes: Number(formData.get("durationMinutes")),
    category: String(formData.get("category")),
    mediaType,
    posterUrl: String(formData.get("posterUrl")),
    videoUrl:
      mediaType === "MOVIE" ? String(formData.get("videoUrl") ?? "") : "",
  };
}
