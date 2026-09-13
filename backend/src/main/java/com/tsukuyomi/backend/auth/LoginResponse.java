package com.tsukuyomi.backend.auth;

public class LoginResponse {

    private String token;
    private AuthUserResponse user;

    public LoginResponse(String token, AuthUserResponse user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public AuthUserResponse getUser() {
        return user;
    }
}
