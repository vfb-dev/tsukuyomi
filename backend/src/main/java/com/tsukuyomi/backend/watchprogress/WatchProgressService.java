package com.tsukuyomi.backend.watchprogress;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tsukuyomi.backend.movie.Movie;
import com.tsukuyomi.backend.movie.MovieNotFoundException;
import com.tsukuyomi.backend.movie.MovieRepository;

@Service
public class WatchProgressService {

    private final WatchProgressRepository watchProgressRepository;
    private final MovieRepository movieRepository;

    public WatchProgressService(
            WatchProgressRepository watchProgressRepository,
            MovieRepository movieRepository
    ) {
        this.watchProgressRepository = watchProgressRepository;
        this.movieRepository = movieRepository;
    }

    public List<WatchProgressResponse> getContinueWatching() {
        return watchProgressRepository
                .findByProgressSecondsGreaterThanOrderByIdDesc(0)
                .stream()
                .map(this::toResponse)
                .toList();
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
}