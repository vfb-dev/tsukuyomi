package com.tsukuyomi.backend.episodeprogress;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.tsukuyomi.backend.episode.Episode;
import com.tsukuyomi.backend.episode.EpisodeNotFoundException;
import com.tsukuyomi.backend.episode.EpisodeRepository;
import com.tsukuyomi.backend.user.AppUser;
import com.tsukuyomi.backend.user.AppUserRepository;
import com.tsukuyomi.backend.watchprogress.WatchProgressRequest;

@Service
public class EpisodeWatchProgressService {

    private final EpisodeWatchProgressRepository episodeWatchProgressRepository;
    private final EpisodeRepository episodeRepository;
    private final AppUserRepository appUserRepository;

    public EpisodeWatchProgressService(
            EpisodeWatchProgressRepository episodeWatchProgressRepository,
            EpisodeRepository episodeRepository,
            AppUserRepository appUserRepository
    ) {
        this.episodeWatchProgressRepository = episodeWatchProgressRepository;
        this.episodeRepository = episodeRepository;
        this.appUserRepository = appUserRepository;
    }

    public EpisodeWatchProgressResponse getProgress(
            Long movieId,
            Long episodeId,
            String username
    ) {
        findEpisodeByIdAndMovieId(movieId, episodeId);

        EpisodeWatchProgress progress = episodeWatchProgressRepository
                .findByEpisodeIdAndUserUsername(episodeId, username)
                .orElse(null);

        if (progress == null) {
            return new EpisodeWatchProgressResponse(null, episodeId, 0, false);
        }

        return toResponse(progress);
    }

    public EpisodeWatchProgressResponse saveProgress(
            Long movieId,
            Long episodeId,
            WatchProgressRequest request,
            String username
    ) {
        AppUser user = findUserByUsername(username);
        Episode episode = findEpisodeByIdAndMovieId(movieId, episodeId);

        EpisodeWatchProgress progress = episodeWatchProgressRepository
                .findByEpisodeIdAndUserUsername(episodeId, username)
                .orElseGet(EpisodeWatchProgress::new);

        progress.setUser(user);
        progress.setEpisode(episode);
        progress.setProgressSeconds(request.getProgressSeconds());
        progress.setCompleted(request.getCompleted());
        progress.setUpdatedAt(LocalDateTime.now());

        EpisodeWatchProgress savedProgress = episodeWatchProgressRepository.save(progress);

        return toResponse(savedProgress);
    }

    private Episode findEpisodeByIdAndMovieId(Long movieId, Long episodeId) {
        return episodeRepository.findByIdAndMovieId(episodeId, movieId)
                .orElseThrow(() -> new EpisodeNotFoundException(episodeId));
    }

    private AppUser findUserByUsername(String username) {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }

    private EpisodeWatchProgressResponse toResponse(EpisodeWatchProgress progress) {
        return new EpisodeWatchProgressResponse(
                progress.getId(),
                progress.getEpisode().getId(),
                progress.getProgressSeconds(),
                progress.getCompleted()
        );
    }
}
