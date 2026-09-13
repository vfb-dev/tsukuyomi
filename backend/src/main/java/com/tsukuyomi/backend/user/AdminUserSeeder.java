package com.tsukuyomi.backend.user;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.tsukuyomi.backend.security.AuthProperties;

@Component
public class AdminUserSeeder implements ApplicationRunner {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthProperties authProperties;

    public AdminUserSeeder(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            AuthProperties authProperties
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authProperties = authProperties;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (appUserRepository.existsByUsername(authProperties.getUsername())) {
            return;
        }

        AppUser admin = new AppUser();

        admin.setUsername(authProperties.getUsername());
        admin.setPassword(passwordEncoder.encode(authProperties.getPassword()));
        admin.setRole("ADMIN");

        appUserRepository.save(admin);
    }
}
