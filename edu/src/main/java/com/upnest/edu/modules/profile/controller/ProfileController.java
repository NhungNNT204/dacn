package com.upnest.edu.modules.profile.controller;

import com.upnest.edu.modules.profile.payload.UserProfileDTO;
import com.upnest.edu.modules.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * ProfileController - API endpoints cho user profile
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return Long.parseLong(authentication.getName());
    }

    /**
     * GET /api/v1/profile/achievements
     * Lấy hồ sơ năng lực số đầy đủ
     */
    @GetMapping("/achievements")
    public ResponseEntity<UserProfileDTO> getAchievementsProfile(Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        UserProfileDTO profile = profileService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    /**
     * GET /api/v1/profile/achievements/{userId}
     * Lấy hồ sơ của user khác (public)
     */
    @GetMapping("/achievements/{userId}")
    public ResponseEntity<UserProfileDTO> getPublicAchievementsProfile(@PathVariable Long userId) {
        UserProfileDTO profile = profileService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }
}

