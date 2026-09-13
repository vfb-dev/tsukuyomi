package com.tsukuyomi.backend.watchprogress;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tsukuyomi.backend.episode.Episode;
import com.tsukuyomi.backend.episode.EpisodeResponse;
import com.tsukuyomi.backend.episodeprogress.EpisodeWatchProgress;
import com.tsukuyomi.backend.episodeprogress.EpisodeWatchProgressRepository;
import com.tsukuyomi.backend.favorite.FavoriteRepository;
import com.tsukuyomi.backend.movie.Movie;
import com.tsukuyomi.backend.movie.MovieNotFoundException;
import com.tsukuyomi.backend.movie.MovieRepository;
import com.tsukuyomi.backend.movie.MovieResponse;
import com.tsukuyomi.backend.user.AppUser;
import com.tsukuyomi.backend.user.AppUserRepository;

@Service
public class WatchProgressService {

    private final WatchProgressRepository watchProgressRepository;
    private final EpisodeWatchProgressRepository episodeWatchProgressRepository;
    private final MovieRepository movieRepository;
    private final AppUserRepository appUserRepository;
    private final FavoriteRepository favoriteRepository;

    public WatchProgressService(
            WatchProgressRepository watchProgressRepository,
            EpisodeWatchProgressRepository episodeWatchProgressRepository,
            MovieRepository movieRepository,
            AppUserRepository appUserRepository,
            FavoriteRepository favoriteRepository
    ) {
        this.watchProgressRepository = watchProgressRepository;
        this.episodeWatchProgressRepository = episodeWatchProgressRepository;
        this.movieRepository = movieRepository;
        this.appUserRepository = appUserRepository;
        this.favoriteRepository = favoriteRepository;
    }

    public List<ContinueWatchingResponse> getContinueWatching(String username) {
        List<ContinueWatchingCandidate> candidates = new ArrayList<>();

        watchProgressRepository
                .findByUserUsernameAndProgressSecondsGreaterThanAndCompletedFalseOrderByUpdatedAtDescIdDesc(
                        username,
                        0
                )
                .stream()
                .map(progress -> new ContinueWatchingCandidate(
                        toContinueWatchingResponse(progress, username),
                        progress.getUpdatedAt(),
                        progress.getId()
                ))
                .forEach(candidates::add);

        episodeWatchProgressRepository
                .findByUserUsernameAndProgressSecondsGreaterThanAndCompletedFalseOrderByUpdatedAtDescIdDesc(
                        username,
                        0
                )
                .stream()
                .map(progress -> new ContinueWatchingCandidate(
                        toContinueWatchingResponse(progress, username),
                        progress.getUpdatedAt(),
                        progress.getId()
                ))
                .forEach(candidates::add);

        return candidates.stream()
                .max(this::compareCandidates)
                .map(candidate -> List.of(candidate.response()))
                .orElseGet(List::of);
    }

    public List<ContinueWatchingResponse> getCompletedWatching(String username) {
        List<ContinueWatchingResponse> items = new ArrayList<>();

        List<ContinueWatchingResponse> movieItems = watchProgressRepository
                .findByUserUsernameAndCompletedTrueOrderByUpdatedAtDescIdDesc(username)
                .stream()
                .map(progress -> toContinueWatchingResponse(progress, username))
                .toList();

        List<ContinueWatchingResponse> episodeItems = episodeWatchProgressRepository
                .findByUserUsernameAndCompletedTrueOrderByUpdatedAtDescIdDesc(username)
                .stream()
                .map(progress -> toContinueWatchingResponse(progress, username))
                .toList();

        items.addAll(movieItems);
        items.addAll(episodeItems);

        return items;
    }

    public WatchProgressResponse getProgress(Long movieId, String username) {
        WatchProgress progress = watchProgressRepository
                .findByMovieIdAndUserUsername(movieId, username)
                .orElse(null);

        if (progress == null) {
            return new WatchProgressResponse(null, movieId, 0, false);
        }

        return toResponse(progress);
    }

    public WatchProgressResponse saveProgress(
            Long movieId,
            WatchProgressRequest request,
            String username
    ) {
        AppUser user = findUserByUsername(username);
        Movie movie = movieRepository
                .findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException(movieId));

        WatchProgress progress = watchProgressRepository
                .findByMovieIdAndUserUsername(movieId, username)
                .orElseGet(WatchProgress::new);

        progress.setUser(user);
        progress.setMovie(movie);
        progress.setProgressSeconds(request.getProgressSeconds());
        progress.setCompleted(request.getCompleted());
        progress.setUpdatedAt(LocalDateTime.now());

        WatchProgress savedProgress = watchProgressRepository.save(progress);

        return toResponse(savedProgress);
    }

    private AppUser findUserByUsername(String username) {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }

    private WatchProgressResponse toResponse(WatchProgress progress) {
        return new WatchProgressResponse(
                progress.getId(),
                progress.getMovie().getId(),
                progress.getProgressSeconds(),
                progress.getCompleted()
        );
    }

    private ContinueWatchingResponse toContinueWatchingResponse(WatchProgress progress, String username) {
        return new ContinueWatchingResponse(
                toMovieResponse(progress.getMovie(), username),
                null,
                new ContinueWatchingProgressResponse(
                        progress.getId(),
                        progress.getProgressSeconds(),
                        progress.getCompleted()
                )
        );
    }

    private ContinueWatchingResponse toContinueWatchingResponse(EpisodeWatchProgress progress, String username) {
        Episode episode = progress.getEpisode();

        return new ContinueWatchingResponse(
                toMovieResponse(episode.getMovie(), username),
                toEpisodeResponse(episode),
                new ContinueWatchingProgressResponse(
                        progress.getId(),
                        progress.getProgressSeconds(),
                        progress.getCompleted()
                )
        );
    }

    private MovieResponse toMovieResponse(Movie movie, String username) {
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
                favoriteRepository.existsByMovieIdAndUserUsername(movie.getId(), username)
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
