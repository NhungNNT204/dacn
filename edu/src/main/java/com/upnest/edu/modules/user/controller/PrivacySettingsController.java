package com.upnest.edu.modules.user.controller;

import com.upnest.edu.modules.user.payload.PrivacySettingsResponse;
import com.upnest.edu.modules.user.payload.UpdatePrivacySettingsRequest;
import com.upnest.edu.modules.user.service.PrivacySettingsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller: PrivacySettingsController
 * REST API endpoints cho cài đặt quyền riêng tư
 * 
 * Endpoints:
 * - GET /api/users/privacy-settings - Lấy cài đặt
 * - PUT /api/users/privacy-settings - Cập nhật cài đặt
 * - POST /api/users/privacy-settings/reset - Reset cài đặt
 */

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
public class PrivacySettingsController {
    
    @org.springframework.beans.factory.annotation.Autowired
    private PrivacySettingsService privacySettingsService;
    
    /**
     * Lấy cài đặt quyền riêng tư
     * GET /api/users/privacy-settings
     */
    @GetMapping("/privacy-settings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PrivacySettingsResponse> getPrivacySettings() {
        Long userId = getCurrentUserId();
        log.info("Getting privacy settings for user: {}", userId);
        
        PrivacySettingsResponse response = privacySettingsService.getPrivacySettings(userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật cài đặt quyền riêng tư
     * PUT /api/users/privacy-settings
     */
    @PutMapping("/privacy-settings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PrivacySettingsResponse> updatePrivacySettings(
            @RequestBody UpdatePrivacySettingsRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("Updating privacy settings for user: {}", userId);
        
        PrivacySettingsResponse response = privacySettingsService
                .updatePrivacySettings(userId, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Reset cài đặt quyền riêng tư về mặc định
     * POST /api/users/privacy-settings/reset
     */
    @PostMapping("/privacy-settings/reset")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PrivacySettingsResponse> resetPrivacySettings() {
        Long userId = getCurrentUserId();
        log.info("Resetting privacy settings for user: {}", userId);
        
        PrivacySettingsResponse response = privacySettingsService
                .resetPrivacySettings(userId);
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
