package com.tsukuyomi.backend.watchprogress;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/movies/{movieId}/progress")
public class WatchProgressController {

    private final WatchProgressService watchProgressService;

    public WatchProgressController(WatchProgressService watchProgressService) {
        this.watchProgressService = watchProgressService;
    }

    @GetMapping
    public WatchProgressResponse getProgress(@PathVariable Long movieId) {
        return watchProgressService.getProgress(movieId);
    }

    @PatchMapping
    public WatchProgressResponse saveProgress(
            @PathVariable Long movieId,
            @Valid @RequestBody WatchProgressRequest request
    ) {
        return watchProgressService.saveProgress(movieId, request);
    }
}