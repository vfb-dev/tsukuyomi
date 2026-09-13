package com.tsukuyomi.backend.episodeprogress;

import com.tsukuyomi.backend.episode.Episode;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class EpisodeWatchProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "episode_id", nullable = false, unique = true)
    private Episode episode;

    private Integer progressSeconds = 0;
    private Boolean completed = false;

    public Long getId() {
        return id;
    }

    public Episode getEpisode() {
        return episode;
    }

    public void setEpisode(Episode episode) {
        this.episode = episode;
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
}
