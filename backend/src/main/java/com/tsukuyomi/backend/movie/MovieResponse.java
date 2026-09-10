package com.tsukuyomi.backend.movie;

public record MovieResponse(
        Long id,
        String title,
        String description,
        Integer releaseYear,
        Integer durationMinutes,
        String posterUrl,
        String videoUrl,
        String category,
        Boolean favorite
) {
}