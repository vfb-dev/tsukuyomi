import { MovieInput } from "@/lib/api";

export function getMovieInputFromFormData(formData: FormData): MovieInput {
  return {
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    releaseYear: Number(formData.get("releaseYear")),
    durationMinutes: Number(formData.get("durationMinutes")),
    category: String(formData.get("category")),
    posterUrl: String(formData.get("posterUrl")),
    videoUrl: String(formData.get("videoUrl")),
  };
}
