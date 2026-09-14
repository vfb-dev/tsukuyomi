package com.tsukuyomi.backend.movie;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tsukuyomi.backend.favorite.Favorite;
import com.tsukuyomi.backend.favorite.FavoriteRepository;
import com.tsukuyomi.backend.user.AppUser;
import com.tsukuyomi.backend.user.AppUserRepository;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final FavoriteRepository favoriteRepository;
    private final AppUserRepository appUserRepository;

    public MovieService(
            MovieRepository movieRepository,
            FavoriteRepository favoriteRepository,
            AppUserRepository appUserRepository
    ) {
        this.movieRepository = movieRepository;
        this.favoriteRepository = favoriteRepository;
        this.appUserRepository = appUserRepository;
    }

    public List<MovieResponse> searchMovies(
            String search,
            String category,
            Boolean favorite,
            String username
    ) {
        boolean hasSearch = search != null && !search.isBlank();
        boolean hasCategory = category != null && !category.isBlank();
        boolean onlyFavorites = Boolean.TRUE.equals(favorite);

        List<Movie> movies;

        if (hasSearch && hasCategory) {
            movies = movieRepository.findByTitleContainingIgnoreCaseAndCategoryIgnoreCaseOrderByReleaseYearDesc(
                    search,
                    category
            );
        } else if (hasSearch) {
            movies = movieRepository
                    .findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrderByReleaseYearDesc(
                            search,
                            search
                    );
        } else if (hasCategory) {
            movies = movieRepository.findByCategoryIgnoreCaseOrderByReleaseYearDesc(category);
        } else {
            movies = movieRepository.findAll(Sort.by(Sort.Direction.DESC, "releaseYear"));
        }

        Set<Long> favoriteMovieIds = getFavoriteMovieIds(username);

        return movies.stream()
                .filter(movie -> !onlyFavorites || favoriteMovieIds.contains(movie.getId()))
                .map(movie -> toResponse(movie, favoriteMovieIds.contains(movie.getId())))
                .toList();
    }

    public MovieResponse getMovieById(Long id, String username) {
        Movie movie = findMovieById(id);

        return toResponse(movie, isFavorite(movie.getId(), username));
    }

    public MovieResponse createMovie(MovieRequest request) {
        Movie movie = new Movie();
        String mediaType = request.getMediaType();

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setDurationMinutes(request.getDurationMinutes());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setBackdropUrl(request.getBackdropUrl());
        movie.setVideoUrl(getVideoUrl(request));
        movie.setCategory(request.getCategory());
        movie.setMediaType(mediaType);

        Movie savedMovie = movieRepository.save(movie);

        return toResponse(savedMovie, false);
    }

    public MovieResponse updateMovie(Long id, MovieRequest request, String username) {
        Movie movie = findMovieById(id);
        String mediaType = request.getMediaType();

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setDurationMinutes(request.getDurationMinutes());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setBackdropUrl(request.getBackdropUrl());
        movie.setVideoUrl(getVideoUrl(request));
        movie.setCategory(request.getCategory());
        movie.setMediaType(mediaType);

        Movie updatedMovie = movieRepository.save(movie);

        return toResponse(updatedMovie, isFavorite(updatedMovie.getId(), username));
    }

    @Transactional
    public MovieResponse toggleFavorite(Long id, String username) {
        Movie movie = findMovieById(id);
        Favorite existingFavorite = favoriteRepository
                .findByMovieIdAndUserUsername(id, username)
                .orElse(null);

        if (existingFavorite != null) {
            favoriteRepository.delete(existingFavorite);

            return toResponse(movie, false);
        }

        AppUser user = findUserByUsername(username);
        Favorite favorite = new Favorite();

        favorite.setUser(user);
        favorite.setMovie(movie);

        favoriteRepository.save(favorite);

        return toResponse(movie, true);
    }

    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = findMovieById(id);

        favoriteRepository.deleteAll(favoriteRepository.findByMovieId(id));
        movieRepository.delete(movie);
    }

    private Movie findMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
    }

    private AppUser findUserByUsername(String username) {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }

    private Set<Long> getFavoriteMovieIds(String username) {
        if (username == null || username.isBlank()) {
            return Set.of();
        }

        return favoriteRepository.findByUserUsername(username)
                .stream()
                .map(Favorite::getMovie)
                .map(Movie::getId)
                .collect(Collectors.toSet());
    }

    private boolean isFavorite(Long movieId, String username) {
        if (username == null || username.isBlank()) {
            return false;
        }

        return favoriteRepository.existsByMovieIdAndUserUsername(movieId, username);
    }

    private MovieResponse toResponse(Movie movie, boolean favorite) {
        return new MovieResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getDescription(),
                movie.getReleaseYear(),
                movie.getDurationMinutes(),
                movie.getPosterUrl(),
                movie.getBackdropUrl(),
                movie.getVideoUrl(),
                movie.getCategory(),
                getMediaType(movie),
                favorite
        );
    }

    private String getMediaType(Movie movie) {
        if (movie.getMediaType() == null || movie.getMediaType().isBlank()) {
            return "MOVIE";
        }

        return movie.getMediaType();
    }

    private String getVideoUrl(MovieRequest request) {
        if ("ANIME".equals(request.getMediaType())) {
            return "";
        }

        return request.getVideoUrl();
    }
}
