package com.tsukuyomi.backend.episodeprogress;

import org.springframework.security.core.Authentication;
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
            @PathVariable Long episodeId,
            Authentication authentication
    ) {
        return episodeWatchProgressService.getProgress(
                movieId,
                episodeId,
                authentication.getName()
        );
    }

    @PatchMapping
    public EpisodeWatchProgressResponse saveProgress(
            @PathVariable Long movieId,
            @PathVariable Long episodeId,
            @Valid @RequestBody WatchProgressRequest request,
            Authentication authentication
    ) {
        return episodeWatchProgressService.saveProgress(
                movieId,
                episodeId,
                request,
                authentication.getName()
        );
    }
}
