package com.tsukuyomi.backend.movie;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByCategoryIgnoreCase(String category);
    
    List<Movie> findByTitleContainingIgnoreCaseAndCategoryIgnoreCase(String title, String category);
}
