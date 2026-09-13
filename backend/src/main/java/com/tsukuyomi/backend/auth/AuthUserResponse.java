package com.tsukuyomi.backend.auth;

public class AuthUserResponse {

    private String username;
    private String role;

    public AuthUserResponse(String username, String role) {
        this.username = username;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }
}
