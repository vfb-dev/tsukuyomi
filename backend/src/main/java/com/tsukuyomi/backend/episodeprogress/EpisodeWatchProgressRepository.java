package com.tsukuyomi.backend.episodeprogress;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EpisodeWatchProgressRepository extends JpaRepository<EpisodeWatchProgress, Long> {

    Optional<EpisodeWatchProgress> findByEpisodeId(Long episodeId);

    List<EpisodeWatchProgress> findByProgressSecondsGreaterThanAndCompletedFalseOrderByIdDesc(Integer progressSeconds);

    List<EpisodeWatchProgress> findByCompletedTrueOrderByIdDesc();
}
