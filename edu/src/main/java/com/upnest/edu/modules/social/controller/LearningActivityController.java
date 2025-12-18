package com.upnest.edu.modules.social.controller;

import com.upnest.edu.modules.social.entity.LearningActivity;
import com.upnest.edu.modules.social.payload.CreateLearningActivityRequest;
import com.upnest.edu.modules.social.service.LearningActivityService;
import com.upnest.edu.modules.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/social/activity")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@Slf4j
public class LearningActivityController {

    private final LearningActivityService learningActivityService;

    private Long currentUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User u) {
            return u.getUserId();
        }
        return 1L; // fallback for testing
    }

    private String currentUserName(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User u) {
            return u.getFullName() != null ? u.getFullName() : (u.getEmail() != null ? u.getEmail() : "Student");
        }
        return "Student";
    }

    private String currentUserAvatar(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User u) {
            return u.getAvatarUrl();
        }
        return null;
    }

    /**
     * GET /api/v1/social/activity/feed?page=0&size=10
     * Activity feed only: course completion/review/challenge from followed learners.
     */
    @GetMapping("/feed")
    public ResponseEntity<?> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        try {
            Long me = currentUserId(authentication);
            Pageable pageable = PageRequest.of(page, size);
            Page<LearningActivity> result = learningActivityService.getActivityFeed(me, pageable);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", result.getContent(),
                    "totalPages", result.getTotalPages(),
                    "totalElements", result.getTotalElements()
            ));
        } catch (Exception e) {
            log.error("Error getting activity feed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * POST /api/v1/social/activity/create
     * Temporary endpoint to create a learning activity for the current user (for demo/testing).
     */
    @PostMapping("/create")
    public ResponseEntity<?> create(
            @RequestBody CreateLearningActivityRequest request,
            Authentication authentication
    ) {
        try {
            Long me = currentUserId(authentication);
            LearningActivity created = learningActivityService.createMyActivity(
                    me,
                    currentUserName(authentication),
                    currentUserAvatar(authentication),
                    request
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "data", created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid activityType"));
        } catch (Exception e) {
            log.error("Error creating activity", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}






