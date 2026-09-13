package com.tsukuyomi.backend.episode;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/movies/{movieId}/episodes")
public class EpisodeController {

    private final EpisodeService episodeService;

    public EpisodeController(EpisodeService episodeService) {
        this.episodeService = episodeService;
    }

    @GetMapping
    public List<EpisodeResponse> getEpisodes(@PathVariable Long movieId) {
        return episodeService.getEpisodes(movieId);
    }

    @GetMapping("/{episodeId}")
    public EpisodeResponse getEpisode(
            @PathVariable Long movieId,
            @PathVariable Long episodeId
    ) {
        return episodeService.getEpisode(movieId, episodeId);
    }

    @PostMapping
    public EpisodeResponse createEpisode(
            @PathVariable Long movieId,
            @Valid @RequestBody EpisodeRequest request
    ) {
        return episodeService.createEpisode(movieId, request);
    }

    @PutMapping("/{episodeId}")
    public EpisodeResponse updateEpisode(
            @PathVariable Long movieId,
            @PathVariable Long episodeId,
            @Valid @RequestBody EpisodeRequest request
    ) {
        return episodeService.updateEpisode(movieId, episodeId, request);
    }

    @DeleteMapping("/{episodeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEpisode(
            @PathVariable Long movieId,
            @PathVariable Long episodeId
    ) {
        episodeService.deleteEpisode(movieId, episodeId);
    }
}
