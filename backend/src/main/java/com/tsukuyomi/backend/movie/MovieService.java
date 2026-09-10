package com.tsukuyomi.backend.movie;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<MovieResponse> searchMovies(String search, String category, Boolean favorite) {
        boolean hasSearch = search != null && !search.isBlank();
        boolean hasCategory = category != null && !category.isBlank();
        boolean onlyFavorites = Boolean.TRUE.equals(favorite);

        List<Movie> movies;

        if (onlyFavorites) {
            movies = movieRepository.findByFavoriteTrueOrderByReleaseYearDesc();
        } else if (hasSearch && hasCategory) {
            movies = movieRepository.findByTitleContainingIgnoreCaseAndCategoryIgnoreCaseOrderByReleaseYearDesc(
                    search,
                    category
            );
        } else if (hasSearch) {
            movies = movieRepository.findByTitleContainingIgnoreCaseOrderByReleaseYearDesc(search);
        } else if (hasCategory) {
            movies = movieRepository.findByCategoryIgnoreCaseOrderByReleaseYearDesc(category);
        } else {
            movies = movieRepository.findAll(Sort.by(Sort.Direction.DESC, "releaseYear"));
        }

        return movies.stream()
                .map(this::toResponse)
                .toList();
    }

    public MovieResponse getMovieById(Long id) {
        Movie movie = findMovieById(id);

        return toResponse(movie);
    }

    public MovieResponse createMovie(MovieRequest request) {
        Movie movie = new Movie();

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setDurationMinutes(request.getDurationMinutes());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setVideoUrl(request.getVideoUrl());
        movie.setCategory(request.getCategory());
        movie.setFavorite(false);

        Movie savedMovie = movieRepository.save(movie);

        return toResponse(savedMovie);
    }

    public MovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = findMovieById(id);

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setDurationMinutes(request.getDurationMinutes());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setVideoUrl(request.getVideoUrl());
        movie.setCategory(request.getCategory());

        Movie updatedMovie = movieRepository.save(movie);

        return toResponse(updatedMovie);
    }

    public MovieResponse toggleFavorite(Long id) {
        Movie movie = findMovieById(id);
        boolean currentFavorite = Boolean.TRUE.equals(movie.getFavorite());

        movie.setFavorite(!currentFavorite);

        Movie updatedMovie = movieRepository.save(movie);

        return toResponse(updatedMovie);
    }

    public void deleteMovie(Long id) {
        Movie movie = findMovieById(id);

        movieRepository.delete(movie);
    }

    private Movie findMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
    }

    private MovieResponse toResponse(Movie movie) {
        return new MovieResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getDescription(),
                movie.getReleaseYear(),
                movie.getDurationMinutes(),
                movie.getPosterUrl(),
                movie.getVideoUrl(),
                movie.getCategory(),
                movie.getFavorite()
        );
    }
}