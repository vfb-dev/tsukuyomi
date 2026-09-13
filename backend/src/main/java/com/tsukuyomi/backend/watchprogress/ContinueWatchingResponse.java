package com.tsukuyomi.backend.watchprogress;

import com.tsukuyomi.backend.episode.EpisodeResponse;
import com.tsukuyomi.backend.movie.MovieResponse;

public class ContinueWatchingResponse {

    private MovieResponse movie;
    private EpisodeResponse episode;
    private ContinueWatchingProgressResponse progress;

    public ContinueWatchingResponse(
            MovieResponse movie,
            EpisodeResponse episode,
            ContinueWatchingProgressResponse progress
    ) {
        this.movie = movie;
        this.episode = episode;
        this.progress = progress;
    }

    public MovieResponse getMovie() {
        return movie;
    }

    public EpisodeResponse getEpisode() {
        return episode;
    }

    public ContinueWatchingProgressResponse getProgress() {
        return progress;
    }
}
