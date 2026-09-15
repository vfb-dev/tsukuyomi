package com.tsukuyomi.backend.auth;

import java.time.Duration;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.tsukuyomi.backend.security.AuthProperties;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthProperties authProperties;

    public AuthController(AuthService authService, AuthProperties authProperties) {
        this.authService = authService;
        this.authProperties = authProperties;
    }

    @PostMapping("/login")
    public AuthUserResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        LoginResponse loginResponse = authService.login(request);

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                createAuthCookie(
                        loginResponse.getToken(),
                        Duration.ofMinutes(authProperties.getJwtExpirationMinutes())
                ).toString()
        );

        return loginResponse.getUser();
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletResponse response) {
        response.addHeader(
                HttpHeaders.SET_COOKIE,
                createAuthCookie("", Duration.ZERO).toString()
        );
    }

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken csrfToken) {
        return csrfToken;
    }

    @GetMapping("/me")
    public AuthUserResponse me(Authentication authentication) {
        String role = authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .orElse("USER");

        return new AuthUserResponse(authentication.getName(), role);
    }

    private ResponseCookie createAuthCookie(String token, Duration maxAge) {
        return ResponseCookie.from(AuthProperties.AUTH_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(authProperties.isCookieSecure())
                .sameSite(authProperties.getCookieSameSite())
                .path("/")
                .maxAge(maxAge)
                .build();
    }
}
