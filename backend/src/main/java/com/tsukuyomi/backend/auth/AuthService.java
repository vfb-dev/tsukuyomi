package com.tsukuyomi.backend.auth;

import java.util.Objects;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.tsukuyomi.backend.security.AuthProperties;
import com.tsukuyomi.backend.security.JwtService;

@Service
public class AuthService {

    private final AuthProperties authProperties;
    private final JwtService jwtService;

    public AuthService(AuthProperties authProperties, JwtService jwtService) {
        this.authProperties = authProperties;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        boolean usernameMatches = Objects.equals(authProperties.getUsername(), request.getUsername());
        boolean passwordMatches = Objects.equals(authProperties.getPassword(), request.getPassword());

        if (!usernameMatches || !passwordMatches) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtService.createToken(request.getUsername());

        return new LoginResponse(token);
    }
}