package com.tsukuyomi.backend.movie;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByTitleContainingIgnoreCaseOrderByReleaseYearDesc(String title);

    List<Movie> findByCategoryIgnoreCaseOrderByReleaseYearDesc(String category);

    List<Movie> findByFavoriteTrueOrderByReleaseYearDesc();

    List<Movie> findByTitleContainingIgnoreCaseAndCategoryIgnoreCaseOrderByReleaseYearDesc(
            String title,
            String category
    );
}