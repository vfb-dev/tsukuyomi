package com.tsukuyomi.backend.episode;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EpisodeRepository extends JpaRepository<Episode, Long> {

    List<Episode> findByMovieIdOrderBySeasonNumberAscEpisodeNumberAsc(Long movieId);

    Optional<Episode> findByIdAndMovieId(Long id, Long movieId);
}
