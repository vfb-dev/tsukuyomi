package com.tsukuyomi.backend.watchprogress;

public record ContinueWatchingProgressResponse(
        Long id,
        Integer progressSeconds,
        Boolean completed
) {
}
