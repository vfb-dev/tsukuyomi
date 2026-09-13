package com.tsukuyomi.backend.episode;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class EpisodeNotFoundException extends RuntimeException {

    public EpisodeNotFoundException(Long id) {
        super("Episode not found with id: " + id);
    }
}
