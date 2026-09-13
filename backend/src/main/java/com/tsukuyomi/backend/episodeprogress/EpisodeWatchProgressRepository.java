package com.tsukuyomi.backend.episodeprogress;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EpisodeWatchProgressRepository extends JpaRepository<EpisodeWatchProgress, Long> {

    Optional<EpisodeWatchProgress> findByEpisodeIdAndUserUsername(Long episodeId, String username);

    List<EpisodeWatchProgress> findByUserUsernameAndProgressSecondsGreaterThanAndCompletedFalseOrderByUpdatedAtDescIdDesc(
            String username,
            Integer progressSeconds
    );

    List<EpisodeWatchProgress> findByUserUsernameAndCompletedTrueOrderByUpdatedAtDescIdDesc(String username);

    List<EpisodeWatchProgress> findByEpisodeId(Long episodeId);
}
