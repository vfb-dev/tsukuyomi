package com.tsukuyomi.backend.user;

public record AppUserResponse(
        Long id,
        String username,
        String role
) {
}
