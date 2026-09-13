package com.tsukuyomi.backend.watchprogress;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchProgressRepository extends JpaRepository<WatchProgress, Long> {

    Optional<WatchProgress> findByMovieIdAndUserUsername(Long movieId, String username);

    List<WatchProgress> findByUserUsernameAndProgressSecondsGreaterThanAndCompletedFalseOrderByUpdatedAtDescIdDesc(
            String username,
            Integer progressSeconds
    );

    List<WatchProgress> findByUserUsernameAndCompletedTrueOrderByUpdatedAtDescIdDesc(String username);
}
