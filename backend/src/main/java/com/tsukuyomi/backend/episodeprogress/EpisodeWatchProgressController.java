package com.tsukuyomi.backend.episodeprogress;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tsukuyomi.backend.watchprogress.WatchProgressRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/movies/{movieId}/episodes/{episodeId}/progress")
public class EpisodeWatchProgressController {

    private final EpisodeWatchProgressService episodeWatchProgressService;

    public EpisodeWatchProgressController(EpisodeWatchProgressService episodeWatchProgressService) {
        this.episodeWatchProgressService = episodeWatchProgressService;
    }

    @GetMapping
    public EpisodeWatchProgressResponse getProgress(
            @PathVariable Long movieId,
            @PathVariable Long episodeId
    ) {
        return episodeWatchProgressService.getProgress(movieId, episodeId);
    }

    @PatchMapping
    public EpisodeWatchProgressResponse saveProgress(
            @PathVariable Long movieId,
            @PathVariable Long episodeId,
            @Valid @RequestBody WatchProgressRequest request
    ) {
        return episodeWatchProgressService.saveProgress(movieId, episodeId, request);
    }
}
