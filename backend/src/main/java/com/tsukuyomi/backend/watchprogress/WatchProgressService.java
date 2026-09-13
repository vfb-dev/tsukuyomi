package com.tsukuyomi.backend.watchprogress;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tsukuyomi.backend.episode.Episode;
import com.tsukuyomi.backend.episode.EpisodeResponse;
import com.tsukuyomi.backend.episodeprogress.EpisodeWatchProgress;
import com.tsukuyomi.backend.episodeprogress.EpisodeWatchProgressRepository;
import com.tsukuyomi.backend.movie.Movie;
import com.tsukuyomi.backend.movie.MovieNotFoundException;
import com.tsukuyomi.backend.movie.MovieRepository;
import com.tsukuyomi.backend.movie.MovieResponse;

@Service
public class WatchProgressService {

    private final WatchProgressRepository watchProgressRepository;
    private final EpisodeWatchProgressRepository episodeWatchProgressRepository;
    private final MovieRepository movieRepository;

    public WatchProgressService(
            WatchProgressRepository watchProgressRepository,
            EpisodeWatchProgressRepository episodeWatchProgressRepository,
            MovieRepository movieRepository
    ) {
        this.watchProgressRepository = watchProgressRepository;
        this.episodeWatchProgressRepository = episodeWatchProgressRepository;
        this.movieRepository = movieRepository;
    }

    public List<ContinueWatchingResponse> getContinueWatching() {
        List<ContinueWatchingCandidate> candidates = new ArrayList<>();

        watchProgressRepository
                .findByProgressSecondsGreaterThanAndCompletedFalseOrderByIdDesc(0)
                .stream()
                .map(progress -> new ContinueWatchingCandidate(
                        toContinueWatchingResponse(progress),
                        progress.getUpdatedAt(),
                        progress.getId()
                ))
                .forEach(candidates::add);

        episodeWatchProgressRepository
                .findByProgressSecondsGreaterThanAndCompletedFalseOrderByIdDesc(0)
                .stream()
                .map(progress -> new ContinueWatchingCandidate(
                        toContinueWatchingResponse(progress),
                        progress.getUpdatedAt(),
                        progress.getId()
                ))
                .forEach(candidates::add);

        return candidates.stream()
                .max(this::compareCandidates)
                .map(candidate -> List.of(candidate.response()))
                .orElseGet(List::of);
    }

    public List<ContinueWatchingResponse> getCompletedWatching() {
        List<ContinueWatchingResponse> items = new ArrayList<>();

        List<ContinueWatchingResponse> movieItems = watchProgressRepository
                .findByCompletedTrueOrderByIdDesc()
                .stream()
                .map(this::toContinueWatchingResponse)
                .toList();

        List<ContinueWatchingResponse> episodeItems = episodeWatchProgressRepository
                .findByCompletedTrueOrderByIdDesc()
                .stream()
                .map(this::toContinueWatchingResponse)
                .toList();

        items.addAll(movieItems);
        items.addAll(episodeItems);

        return items;
    }

    public WatchProgressResponse getProgress(Long movieId) {
        WatchProgress progress = watchProgressRepository
                .findByMovieId(movieId)
                .orElse(null);

        if (progress == null) {
            return new WatchProgressResponse(null, movieId, 0, false);
        }

        return toResponse(progress);
    }

    public WatchProgressResponse saveProgress(
            Long movieId,
            WatchProgressRequest request
    ) {
        Movie movie = movieRepository
                .findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException(movieId));

        WatchProgress progress = watchProgressRepository
                .findByMovieId(movieId)
                .orElseGet(WatchProgress::new);

        progress.setMovie(movie);
        progress.setProgressSeconds(request.getProgressSeconds());
        progress.setCompleted(request.getCompleted());
        progress.setUpdatedAt(LocalDateTime.now());

        WatchProgress savedProgress = watchProgressRepository.save(progress);

        return toResponse(savedProgress);
    }

    private WatchProgressResponse toResponse(WatchProgress progress) {
        return new WatchProgressResponse(
                progress.getId(),
                progress.getMovie().getId(),
                progress.getProgressSeconds(),
                progress.getCompleted()
        );
    }

    private ContinueWatchingResponse toContinueWatchingResponse(WatchProgress progress) {
        return new ContinueWatchingResponse(
                toMovieResponse(progress.getMovie()),
                null,
                new ContinueWatchingProgressResponse(
                        progress.getId(),
                        progress.getProgressSeconds(),
                        progress.getCompleted()
                )
        );
    }

    private ContinueWatchingResponse toContinueWatchingResponse(EpisodeWatchProgress progress) {
        Episode episode = progress.getEpisode();

        return new ContinueWatchingResponse(
                toMovieResponse(episode.getMovie()),
                toEpisodeResponse(episode),
                new ContinueWatchingProgressResponse(
                        progress.getId(),
                        progress.getProgressSeconds(),
                        progress.getCompleted()
                )
        );
    }

    private MovieResponse toMovieResponse(Movie movie) {
        return new MovieResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getDescription(),
                movie.getReleaseYear(),
                movie.getDurationMinutes(),
                movie.getPosterUrl(),
                movie.getVideoUrl(),
                movie.getCategory(),
                getMediaType(movie),
                movie.getFavorite()
        );
    }

    private String getMediaType(Movie movie) {
        if (movie.getMediaType() == null || movie.getMediaType().isBlank()) {
            return "MOVIE";
        }

        return movie.getMediaType();
    }

    private EpisodeResponse toEpisodeResponse(Episode episode) {
        return new EpisodeResponse(
                episode.getId(),
                episode.getMovie().getId(),
                episode.getTitle(),
                episode.getEpisodeNumber(),
                episode.getSeasonNumber(),
                episode.getDurationMinutes(),
                episode.getVideoUrl()
        );
    }

    private int compareCandidates(
            ContinueWatchingCandidate first,
            ContinueWatchingCandidate second
    ) {
        LocalDateTime firstUpdatedAt = first.updatedAt();
        LocalDateTime secondUpdatedAt = second.updatedAt();

        if (firstUpdatedAt != null && secondUpdatedAt != null) {
            return firstUpdatedAt.compareTo(secondUpdatedAt);
        }

        if (firstUpdatedAt != null) {
            return 1;
        }

        if (secondUpdatedAt != null) {
            return -1;
        }

        return Long.compare(getCandidateId(first), getCandidateId(second));
    }

    private long getCandidateId(ContinueWatchingCandidate candidate) {
        if (candidate.id() == null) {
            return 0;
        }

        return candidate.id();
    }

    private record ContinueWatchingCandidate(
            ContinueWatchingResponse response,
            LocalDateTime updatedAt,
            Long id
    ) {
    }
}
