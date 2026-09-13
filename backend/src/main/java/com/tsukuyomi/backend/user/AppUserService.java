package com.tsukuyomi.backend.user;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.tsukuyomi.backend.episodeprogress.EpisodeWatchProgressRepository;
import com.tsukuyomi.backend.favorite.FavoriteRepository;
import com.tsukuyomi.backend.watchprogress.WatchProgressRepository;

@Service
public class AppUserService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final FavoriteRepository favoriteRepository;
    private final WatchProgressRepository watchProgressRepository;
    private final EpisodeWatchProgressRepository episodeWatchProgressRepository;

    public AppUserService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            FavoriteRepository favoriteRepository,
            WatchProgressRepository watchProgressRepository,
            EpisodeWatchProgressRepository episodeWatchProgressRepository
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.favoriteRepository = favoriteRepository;
        this.watchProgressRepository = watchProgressRepository;
        this.episodeWatchProgressRepository = episodeWatchProgressRepository;
    }

    public List<AppUserResponse> getUsers() {
        return appUserRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AppUserResponse createUser(AppUserRequest request) {
        if (appUserRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        AppUser user = new AppUser();

        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        AppUser savedUser = appUserRepository.save(user);

        return toResponse(savedUser);
    }

    @Transactional
    public void deleteUser(Long id, String currentUsername) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getUsername().equals(currentUsername)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot delete your own account");
        }

        if (ADMIN_ROLE.equals(user.getRole()) && appUserRepository.countByRole(ADMIN_ROLE) <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot delete the last admin account");
        }

        favoriteRepository.deleteAll(favoriteRepository.findByUserId(id));
        watchProgressRepository.deleteAll(watchProgressRepository.findByUserId(id));
        episodeWatchProgressRepository.deleteAll(episodeWatchProgressRepository.findByUserId(id));
        appUserRepository.delete(user);
    }

    private AppUserResponse toResponse(AppUser user) {
        return new AppUserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }
}
