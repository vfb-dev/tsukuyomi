package com.tsukuyomi.backend.watchprogress;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class WatchProgressController {

    private final WatchProgressService watchProgressService;

    public WatchProgressController(WatchProgressService watchProgressService) {
        this.watchProgressService = watchProgressService;
    }

    @GetMapping("/watch-progress/continue")
    public List<ContinueWatchingResponse> getContinueWatching() {
        return watchProgressService.getContinueWatching();
    }

    @GetMapping("/watch-progress/completed")
    public List<ContinueWatchingResponse> getCompletedWatching() {
        return watchProgressService.getCompletedWatching();
    }

    @GetMapping("/movies/{movieId}/progress")
    public WatchProgressResponse getProgress(@PathVariable Long movieId) {
        return watchProgressService.getProgress(movieId);
    }

    @PatchMapping("/movies/{movieId}/progress")
    public WatchProgressResponse saveProgress(
            @PathVariable Long movieId,
            @Valid @RequestBody WatchProgressRequest request
    ) {
        return watchProgressService.saveProgress(movieId, request);
    }
}