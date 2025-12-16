package com.upnest.edu.modules.user.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upnest.edu.modules.user.payload.UpdateProfileRequest;
import com.upnest.edu.modules.user.payload.UserProfileResponse;
import com.upnest.edu.modules.user.service.UserProfileService;

import lombok.extern.slf4j.Slf4j;

/**
 * Controller: ProfileController
 * REST API endpoints cho hồ sơ cá nhân
 * 
 * Endpoints:
 * - GET /api/users/profile - Lấy hồ sơ cá nhân
 * - GET /api/users/{userId}/profile - Lấy hồ sơ user khác
 * - PUT /api/users/profile - Cập nhật hồ sơ
 * - POST /api/users/profile/avatar - Cập nhật ảnh đại diện
 */

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
public class ProfileController {
    
    @org.springframework.beans.factory.annotation.Autowired
    private UserProfileService userProfileService;
    
    /**
     * Lấy hồ sơ cá nhân của user hiện tại
     * GET /api/users/profile
     */
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        Long userId = getCurrentUserId();
        log.info("Getting profile for current user: {}", userId);
        
        UserProfileResponse response = userProfileService.getProfile(userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy hồ sơ của user khác
     * GET /api/users/{userId}/profile
     */
    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long userId) {
        log.info("Getting profile for user: {}", userId);
        
        UserProfileResponse response = userProfileService.getProfile(userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật hồ sơ cá nhân
     * PUT /api/users/profile
     */
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody UpdateProfileRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("Updating profile for user: {}", userId);
        
        UserProfileResponse response = userProfileService.updateProfile(userId, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật ảnh đại diện
     * POST /api/users/profile/avatar
     */
    @PostMapping("/profile/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> updateAvatar(
            @RequestBody Map<String, String> request) {
        
        Long userId = getCurrentUserId();
        String avatarUrl = request.get("avatarUrl");
        
        log.info("Updating avatar for user: {}", userId);
        
        UserProfileResponse response = userProfileService.updateAvatar(userId, avatarUrl);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy userId từ SecurityContext
     */
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Long.valueOf(auth.getName());
    }
}
