package com.tsukuyomi.backend.watchprogress;

public class WatchProgressResponse {

    private Long id;
    private Long movieId;
    private Integer progressSeconds;
    private Boolean completed;

    public WatchProgressResponse(
            Long id,
            Long movieId,
            Integer progressSeconds,
            Boolean completed
    ) {
        this.id = id;
        this.movieId = movieId;
        this.progressSeconds = progressSeconds;
        this.completed = completed;
    }

    public Long getId() {
        return id;
    }

    public Long getMovieId() {
        return movieId;
    }

    public Integer getProgressSeconds() {
        return progressSeconds;
    }

    public Boolean getCompleted() {
        return completed;
    }
}