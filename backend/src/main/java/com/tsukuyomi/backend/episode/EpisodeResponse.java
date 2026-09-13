package com.tsukuyomi.backend.episode;

public record EpisodeResponse(
        Long id,
        Long movieId,
        String title,
        Integer episodeNumber,
        Integer seasonNumber,
        Integer durationMinutes,
        String videoUrl
) {
}
