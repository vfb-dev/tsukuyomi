package com.tsukuyomi.backend.movie;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class MovieRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @Min(1888)
    private Integer releaseYear;

    @NotNull
    @Min(1)
    private Integer durationMinutes;

    @NotBlank
    private String posterUrl;

    private String videoUrl;

    @NotBlank
    private String category;

    @NotBlank
    @Pattern(regexp = "MOVIE|ANIME", message = "Type must be MOVIE or ANIME")
    private String mediaType;

    @AssertTrue(message = "Video URL is required for movies")
    public boolean isVideoUrlValidForMediaType() {
        if (!"MOVIE".equals(mediaType)) {
            return true;
        }

        return videoUrl != null && !videoUrl.isBlank();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }
}
