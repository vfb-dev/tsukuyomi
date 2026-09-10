package com.tsukuyomi.backend.watchprogress;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchProgressRepository extends JpaRepository<WatchProgress, Long> {

    Optional<WatchProgress> findByMovieId(Long movieId);

    List<WatchProgress> findByProgressSecondsGreaterThanOrderByIdDesc(Integer progressSeconds);
}