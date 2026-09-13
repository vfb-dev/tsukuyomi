package com.tsukuyomi.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/health",
                                "/api/auth/login"
                        ).permitAll()
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/movies/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.GET, "/api/watch-progress/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.PATCH, "/api/movies/*/progress").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.PATCH, "/api/movies/*/episodes/*/progress").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.POST, "/api/movies").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/movies/*/episodes").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/movies/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/movies/*/episodes/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/movies/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/movies/*/episodes/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/movies/*/favorite").hasAnyRole("ADMIN", "USER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
