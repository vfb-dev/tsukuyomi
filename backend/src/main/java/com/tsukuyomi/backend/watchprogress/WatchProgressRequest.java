package com.tsukuyomi.backend.watchprogress;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class WatchProgressRequest {

    @NotNull(message = "Progress seconds is required")
    @Min(value = 0, message = "Progress seconds cannot be negative")
    private Integer progressSeconds;

    @NotNull(message = "Completed is required")
    private Boolean completed;

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