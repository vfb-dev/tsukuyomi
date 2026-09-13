import { EpisodeInput } from "@/types/episode";

export function getEpisodeInputFromFormData(formData: FormData): EpisodeInput {
  return {
    title: String(formData.get("title")),
    episodeNumber: Number(formData.get("episodeNumber")),
    seasonNumber: Number(formData.get("seasonNumber")),
    durationMinutes: Number(formData.get("durationMinutes")),
    videoUrl: String(formData.get("videoUrl")),
  };
}
