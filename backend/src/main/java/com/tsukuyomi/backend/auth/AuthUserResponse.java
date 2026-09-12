package com.tsukuyomi.backend.auth;

public class AuthUserResponse {

    private String username;

    public AuthUserResponse(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}