package com.upnest.edu.modules.social.controller;

import com.upnest.edu.modules.social.entity.*;
import com.upnest.edu.modules.social.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ProfileController - REST API cho hồ sơ cá nhân
 * 12+ endpoints cho các hoạt động profile
 */
@RestController
@RequestMapping("/api/v1/social/profiles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {
    
    private final ProfileService profileService;
    
    // ==================== PROFILE ENDPOINTS ====================
    
    /**
     * GET /api/v1/social/profiles/{userId}
     * Lấy hồ sơ của người dùng
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        try {
            UserProfile profile = profileService.getProfile(userId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", profile
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "Hồ sơ không tồn tại: " + e.getMessage()
            ));
        }
    }
    
    /**
     * POST /api/v1/social/profiles
     * Tạo hồ sơ mới
     */
    @PostMapping
    public ResponseEntity<?> createProfile(@RequestBody CreateProfileRequest request) {
        try {
            UserProfile profile = profileService.createProfile(
                    request.userId,
                    request.firstName,
                    request.lastName,
                    request.email
            );
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", profile,
                    "message", "Tạo hồ sơ thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi tạo hồ sơ: " + e.getMessage()
            ));
        }
    }
    
    /**
     * PUT /api/v1/social/profiles/{userId}
     * Cập nhật thông tin profile
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody ProfileService.UpdateProfileRequest request) {
        try {
            UserProfile updated = profileService.updateProfile(userId, request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", updated,
                    "message", "Cập nhật hồ sơ thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi cập nhật: " + e.getMessage()
            ));
        }
    }
    
    /**
     * POST /api/v1/social/profiles/{userId}/avatar
     * Upload ảnh đại diện
     */
    @PostMapping("/{userId}/avatar")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        try {
            String avatarUrl = request.get("avatarUrl");
            UserProfile updated = profileService.uploadAvatar(userId, avatarUrl);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", updated,
                    "message", "Upload ảnh đại diện thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi upload ảnh: " + e.getMessage()
            ));
        }
    }
    
    /**
     * POST /api/v1/social/profiles/{userId}/cover
     * Upload ảnh bìa
     */
    @PostMapping("/{userId}/cover")
    public ResponseEntity<?> uploadCover(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        try {
            String coverUrl = request.get("coverUrl");
            UserProfile updated = profileService.uploadCover(userId, coverUrl);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", updated,
                    "message", "Upload ảnh bìa thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi upload ảnh: " + e.getMessage()
            ));
        }
    }
    
    // ==================== STORY ENDPOINTS ====================
    
    /**
     * POST /api/v1/social/profiles/{userId}/stories
     * Thêm story mới
     */
    @PostMapping("/{userId}/stories")
    public ResponseEntity<?> addStory(
            @PathVariable Long userId,
            @RequestBody AddStoryRequest request) {
        try {
            Story story = profileService.addStory(
                    userId,
                    request.mediaUrl,
                    request.mediaType,
                    request.caption
            );
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", story,
                    "message", "Thêm story thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi thêm story: " + e.getMessage()
            ));
        }
    }
    
    /**
     * GET /api/v1/social/profiles/{userId}/stories
     * Lấy stories của người dùng
     */
    @GetMapping("/{userId}/stories")
    public ResponseEntity<?> getUserStories(@PathVariable Long userId) {
        try {
            List<Story> stories = profileService.getUserStories(userId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", stories,
                    "count", stories.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi lấy stories: " + e.getMessage()
            ));
        }
    }
    
    // ==================== STORY HIGHLIGHT ENDPOINTS ====================
    
    /**
     * POST /api/v1/social/profiles/{userId}/highlights
     * Tạo story highlight
     */
    @PostMapping("/{userId}/highlights")
    public ResponseEntity<?> createHighlight(
            @PathVariable Long userId,
            @RequestBody CreateHighlightRequest request) {
        try {
            StoryHighlight highlight = profileService.createHighlight(
                    userId,
                    request.title,
                    request.description,
                    request.thumbnailUrl
            );
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", highlight,
                    "message", "Tạo highlight thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi tạo highlight: " + e.getMessage()
            ));
        }
    }
    
    /**
     * GET /api/v1/social/profiles/{userId}/highlights
     * Lấy highlights của người dùng
     */
    @GetMapping("/{userId}/highlights")
    public ResponseEntity<?> getUserHighlights(@PathVariable Long userId) {
        try {
            List<StoryHighlight> highlights = profileService.getUserHighlights(userId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", highlights,
                    "count", highlights.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi lấy highlights: " + e.getMessage()
            ));
        }
    }
    
    /**
     * POST /api/v1/social/profiles/highlights/{highlightId}/stories
     * Thêm story vào highlight
     */
    @PostMapping("/highlights/{highlightId}/stories")
    public ResponseEntity<?> addStoryToHighlight(
            @PathVariable Long highlightId,
            @RequestBody Map<String, Long> request) {
        try {
            Long storyId = request.get("storyId");
            StoryHighlight updated = profileService.addStoryToHighlight(highlightId, storyId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", updated,
                    "message", "Thêm story vào highlight thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi: " + e.getMessage()
            ));
        }
    }
    
    /**
     * DELETE /api/v1/social/profiles/highlights/{highlightId}
     * Xóa highlight
     */
    @DeleteMapping("/highlights/{highlightId}")
    public ResponseEntity<?> deleteHighlight(@PathVariable Long highlightId) {
        try {
            profileService.deleteHighlight(highlightId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Xóa highlight thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi xóa: " + e.getMessage()
            ));
        }
    }
    
    // ==================== FOLLOW ENDPOINTS ====================
    
    /**
     * POST /api/v1/social/profiles/{toUserId}/follow
     * Follow người dùng
     */
    @PostMapping("/{toUserId}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long toUserId) {
        try {
            Long fromUserId = getCurrentUserId(); // Lấy từ JWT
            profileService.followUser(fromUserId, toUserId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Follow thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi: " + e.getMessage()
            ));
        }
    }
    
    /**
     * DELETE /api/v1/social/profiles/{toUserId}/follow
     * Unfollow người dùng
     */
    @DeleteMapping("/{toUserId}/follow")
    public ResponseEntity<?> unfollowUser(@PathVariable Long toUserId) {
        try {
            Long fromUserId = getCurrentUserId(); // Lấy từ JWT
            profileService.unfollowUser(fromUserId, toUserId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Unfollow thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi: " + e.getMessage()
            ));
        }
    }
    
    // ==================== PRIVACY SETTINGS ENDPOINTS ====================
    
    /**
     * GET /api/v1/social/profiles/{userId}/privacy
     * Lấy cài đặt riêng tư
     */
    @GetMapping("/{userId}/privacy")
    public ResponseEntity<?> getPrivacySettings(@PathVariable Long userId) {
        try {
            PrivacySettings settings = profileService.getPrivacySettings(userId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", settings
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi: " + e.getMessage()
            ));
        }
    }
    
    /**
     * PUT /api/v1/social/profiles/{userId}/privacy
     * Cập nhật cài đặt riêng tư
     */
    @PutMapping("/{userId}/privacy")
    public ResponseEntity<?> updatePrivacySettings(
            @PathVariable Long userId,
            @RequestBody ProfileService.PrivacySettingsRequest request) {
        try {
            PrivacySettings updated = profileService.updatePrivacySettings(userId, request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", updated,
                    "message", "Cập nhật cài đặt thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi: " + e.getMessage()
            ));
        }
    }
    
    // ==================== SEARCH ENDPOINTS ====================
    
    /**
     * GET /api/v1/social/profiles/search?keyword=...
     * Tìm kiếm profile
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchProfiles(@RequestParam String keyword) {
        try {
            List<UserProfile> results = profileService.searchProfiles(keyword);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", results,
                    "count", results.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi: " + e.getMessage()
            ));
        }
    }
    
    /**
     * GET /api/v1/social/profiles/top/followers?limit=10
     * Lấy người dùng được follow nhiều nhất
     */
    @GetMapping("/top/followers")
    public ResponseEntity<?> getTopFollowedUsers(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<UserProfile> results = profileService.getTopFollowedUsers(limit);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", results,
                    "count", results.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Lỗi: " + e.getMessage()
            ));
        }
    }
    
    // ==================== HELPER METHODS ====================
    
    private Long getCurrentUserId() {
        // TODO: Lấy từ JWT token
        return 1L; // Placeholder for testing
    }
    
    // ==================== REQUEST/RESPONSE CLASSES ====================
    
    public static class CreateProfileRequest {
        public Long userId;
        public String firstName;
        public String lastName;
        public String email;
    }
    
    public static class AddStoryRequest {
        public String mediaUrl;
        public String mediaType; // IMAGE, VIDEO
        public String caption;
    }
    
    public static class CreateHighlightRequest {
        public String title;
        public String description;
        public String thumbnailUrl;
    }
}
