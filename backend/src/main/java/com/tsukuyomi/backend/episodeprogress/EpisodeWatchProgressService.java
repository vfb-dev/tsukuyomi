package com.tsukuyomi.backend.episodeprogress;

import org.springframework.stereotype.Service;

import com.tsukuyomi.backend.episode.Episode;
import com.tsukuyomi.backend.episode.EpisodeNotFoundException;
import com.tsukuyomi.backend.episode.EpisodeRepository;
import com.tsukuyomi.backend.watchprogress.WatchProgressRequest;

@Service
public class EpisodeWatchProgressService {

    private final EpisodeWatchProgressRepository episodeWatchProgressRepository;
    private final EpisodeRepository episodeRepository;

    public EpisodeWatchProgressService(
            EpisodeWatchProgressRepository episodeWatchProgressRepository,
            EpisodeRepository episodeRepository
    ) {
        this.episodeWatchProgressRepository = episodeWatchProgressRepository;
        this.episodeRepository = episodeRepository;
    }

    public EpisodeWatchProgressResponse getProgress(Long movieId, Long episodeId) {
        findEpisodeByIdAndMovieId(movieId, episodeId);

        EpisodeWatchProgress progress = episodeWatchProgressRepository
                .findByEpisodeId(episodeId)
                .orElse(null);

        if (progress == null) {
            return new EpisodeWatchProgressResponse(null, episodeId, 0, false);
        }

        return toResponse(progress);
    }

    public EpisodeWatchProgressResponse saveProgress(
            Long movieId,
            Long episodeId,
            WatchProgressRequest request
    ) {
        Episode episode = findEpisodeByIdAndMovieId(movieId, episodeId);

        EpisodeWatchProgress progress = episodeWatchProgressRepository
                .findByEpisodeId(episodeId)
                .orElseGet(EpisodeWatchProgress::new);

        progress.setEpisode(episode);
        progress.setProgressSeconds(request.getProgressSeconds());
        progress.setCompleted(request.getCompleted());

        EpisodeWatchProgress savedProgress = episodeWatchProgressRepository.save(progress);

        return toResponse(savedProgress);
    }

    private Episode findEpisodeByIdAndMovieId(Long movieId, Long episodeId) {
        return episodeRepository.findByIdAndMovieId(episodeId, movieId)
                .orElseThrow(() -> new EpisodeNotFoundException(episodeId));
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
