package com.tsukuyomi.backend.episodeprogress;

public record EpisodeWatchProgressResponse(
        Long id,
        Long episodeId,
        Integer progressSeconds,
        Boolean completed
) {
}
