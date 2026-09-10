package com.tsukuyomi.backend.watchprogress;

import com.tsukuyomi.backend.movie.MovieResponse;

public class ContinueWatchingResponse {

    private MovieResponse movie;
    private WatchProgressResponse progress;

    public ContinueWatchingResponse(
            MovieResponse movie,
            WatchProgressResponse progress
    ) {
        this.movie = movie;
        this.progress = progress;
    }

    public MovieResponse getMovie() {
        return movie;
    }

    public WatchProgressResponse getProgress() {
        return progress;
    }
}