package com.tsukuyomi.backend.favorite;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserUsername(String username);

    List<Favorite> findByMovieId(Long movieId);

    Optional<Favorite> findByMovieIdAndUserUsername(Long movieId, String username);

    boolean existsByMovieIdAndUserUsername(Long movieId, String username);
}
