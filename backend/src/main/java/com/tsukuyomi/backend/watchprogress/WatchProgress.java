package com.tsukuyomi.backend.watchprogress;

import java.time.LocalDateTime;

import com.tsukuyomi.backend.movie.Movie;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class WatchProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "movie_id", nullable = false, unique = true)
    private Movie movie;

    private Integer progressSeconds;

    private Boolean completed = false;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Integer getProgressSeconds() {
        return progressSeconds;
    }

    public void setProgressSeconds(Integer progressSeconds) {
        this.progressSeconds = progressSeconds;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
