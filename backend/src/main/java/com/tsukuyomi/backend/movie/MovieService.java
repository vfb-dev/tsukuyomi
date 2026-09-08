package com.tsukuyomi.backend.movie;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public List<Movie> searchMovies(String search, String category) {
        boolean hasSearch = search != null && !search.isBlank();
        boolean hasCategory = category != null && !category.isBlank();

        if (hasSearch && hasCategory) {
            return movieRepository.findByTitleContainingIgnoreCaseAndCategoryIgnoreCase(search, category);
        }

        if (hasSearch) {
            return movieRepository.findByTitleContainingIgnoreCase(search);
        }

        if (hasCategory) {
            return movieRepository.findByCategoryIgnoreCase(category);
        }

        return getAllMovies();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
    }

    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, Movie updatedMovie) {
        Movie movie = getMovieById(id);

        movie.setTitle(updatedMovie.getTitle());
        movie.setDescription(updatedMovie.getDescription());
        movie.setReleaseYear(updatedMovie.getReleaseYear());
        movie.setDurationMinutes(updatedMovie.getDurationMinutes());
        movie.setPosterUrl(updatedMovie.getPosterUrl());
        movie.setVideoUrl(updatedMovie.getVideoUrl());
        movie.setCategory(updatedMovie.getCategory());

        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        Movie movie = getMovieById(id);
        movieRepository.delete(movie);
    }
}