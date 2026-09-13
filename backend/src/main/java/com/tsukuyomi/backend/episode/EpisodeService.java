package com.tsukuyomi.backend.episode;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tsukuyomi.backend.movie.Movie;
import com.tsukuyomi.backend.movie.MovieNotFoundException;
import com.tsukuyomi.backend.movie.MovieRepository;

@Service
public class EpisodeService {

    private final EpisodeRepository episodeRepository;
    private final MovieRepository movieRepository;

    public EpisodeService(
            EpisodeRepository episodeRepository,
            MovieRepository movieRepository
    ) {
        this.episodeRepository = episodeRepository;
        this.movieRepository = movieRepository;
    }

    public List<EpisodeResponse> getEpisodes(Long movieId) {
        findMovieById(movieId);

        return episodeRepository
                .findByMovieIdOrderBySeasonNumberAscEpisodeNumberAsc(movieId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public EpisodeResponse getEpisode(Long movieId, Long episodeId) {
        Episode episode = findEpisodeByIdAndMovieId(movieId, episodeId);

        return toResponse(episode);
    }

    public EpisodeResponse createEpisode(Long movieId, EpisodeRequest request) {
        Movie movie = findMovieById(movieId);
        Episode episode = new Episode();

        episode.setMovie(movie);
        updateEpisodeFields(episode, request);

        Episode savedEpisode = episodeRepository.save(episode);

        return toResponse(savedEpisode);
    }

    public EpisodeResponse updateEpisode(
            Long movieId,
            Long episodeId,
            EpisodeRequest request
    ) {
        Episode episode = findEpisodeByIdAndMovieId(movieId, episodeId);

        updateEpisodeFields(episode, request);

        Episode updatedEpisode = episodeRepository.save(episode);

        return toResponse(updatedEpisode);
    }

    public void deleteEpisode(Long movieId, Long episodeId) {
        Episode episode = findEpisodeByIdAndMovieId(movieId, episodeId);

        episodeRepository.delete(episode);
    }

    private Movie findMovieById(Long movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException(movieId));
    }

    private Episode findEpisodeByIdAndMovieId(Long movieId, Long episodeId) {
        return episodeRepository.findByIdAndMovieId(episodeId, movieId)
                .orElseThrow(() -> new EpisodeNotFoundException(episodeId));
    }

    private void updateEpisodeFields(Episode episode, EpisodeRequest request) {
        episode.setTitle(request.getTitle());
        episode.setEpisodeNumber(request.getEpisodeNumber());
        episode.setSeasonNumber(request.getSeasonNumber());
        episode.setDurationMinutes(request.getDurationMinutes());
        episode.setVideoUrl(request.getVideoUrl());
    }

    private EpisodeResponse toResponse(Episode episode) {
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
}
