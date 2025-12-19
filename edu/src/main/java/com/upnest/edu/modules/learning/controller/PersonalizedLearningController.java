package com.upnest.edu.modules.learning.controller;

import com.upnest.edu.modules.learning.entity.*;
import com.upnest.edu.modules.learning.payload.*;
import com.upnest.edu.modules.learning.service.PersonalizedLearningService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * PersonalizedLearningController - API endpoints cho quy trình 6 bước
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/personalized-learning")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PersonalizedLearningController {

    private final PersonalizedLearningService personalizedLearningService;

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        // Giả sử authentication principal chứa userId
        // Cần điều chỉnh theo implementation thực tế
        return Long.parseLong(authentication.getName());
    }

    // ========== BƯỚC 1: SKILLS AUDIT ==========

    @PostMapping("/skills-audit")
    public ResponseEntity<SkillsAuditResponse> performSkillsAudit(Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        SkillsAudit audit = personalizedLearningService.performSkillsAudit(userId);
        return ResponseEntity.ok(mapToResponse(audit));
    }

    @GetMapping("/skills-audit")
    public ResponseEntity<SkillsAuditResponse> getSkillsAudit(Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        SkillsAudit audit = personalizedLearningService.performSkillsAudit(userId);
        return ResponseEntity.ok(mapToResponse(audit));
    }

    // ========== BƯỚC 2: SMART GOALS ==========

    @PostMapping("/goals")
    public ResponseEntity<LearningGoalResponse> createGoal(
            @Valid @RequestBody LearningGoalRequest request,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        LearningGoal goal = personalizedLearningService.createSMARTGoal(
                userId, request.getTitle(), request.getDescription(),
                request.getDeadline(), request.getTrackId());
        return ResponseEntity.ok(mapToResponse(goal));
    }

    @GetMapping("/goals")
    public ResponseEntity<List<LearningGoalResponse>> getGoals(Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        // TODO: Implement getGoals method in service
        return ResponseEntity.ok(List.of());
    }

    // ========== BƯỚC 3: ADAPTIVE PLAYLIST ==========

    @PostMapping("/playlists")
    public ResponseEntity<PlaylistResponse> createPlaylist(
            @RequestParam Long goalId,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        LearningPlaylist playlist = personalizedLearningService.createAdaptivePlaylist(userId, goalId);
        return ResponseEntity.ok(mapToResponse(playlist));
    }

    @GetMapping("/playlists/{playlistId}")
    public ResponseEntity<PlaylistResponse> getPlaylist(@PathVariable Long playlistId) {
        // TODO: Implement
        return ResponseEntity.ok(null);
    }

    // ========== BƯỚC 4: SOCIAL TOUCHPOINTS ==========

    @PostMapping("/touchpoints")
    public ResponseEntity<?> createTouchpoint(
            @RequestParam Long playlistId,
            @RequestParam String type,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        SocialTouchpoint.TouchpointType touchpointType = 
                SocialTouchpoint.TouchpointType.valueOf(type);
        SocialTouchpoint touchpoint = personalizedLearningService.createSocialTouchpoint(
                userId, playlistId, touchpointType);
        return ResponseEntity.ok(touchpoint);
    }

    // ========== BƯỚC 5: EARLY ALERTS ==========

    @GetMapping("/alerts")
    public ResponseEntity<List<EarlyAlertResponse>> getAlerts(Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        // TODO: Implement getAlerts
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/alerts/check")
    public ResponseEntity<?> checkAlerts(Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        personalizedLearningService.checkAndCreateAlerts(userId);
        return ResponseEntity.ok().build();
    }

    // ========== BƯỚC 6: ASSESSMENTS ==========

    @PostMapping("/assessments")
    public ResponseEntity<?> createAssessment(
            @RequestParam Long goalId,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        Assessment assessment = personalizedLearningService.createFinalAssessment(userId, goalId);
        return ResponseEntity.ok(assessment);
    }

    // ========== MAPPING METHODS ==========

    private SkillsAuditResponse mapToResponse(SkillsAudit audit) {
        // TODO: Parse JSON fields
        return SkillsAuditResponse.builder()
                .id(audit.getId())
                .userId(audit.getUserId())
                .personaType(audit.getPersonaType().name())
                .overallScore(audit.getOverallScore())
                .build();
    }

    private LearningGoalResponse mapToResponse(LearningGoal goal) {
        return LearningGoalResponse.builder()
                .id(goal.getId())
                .userId(goal.getUserId())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .successCriteria(goal.getSuccessCriteria())
                .feasibilityScore(goal.getFeasibilityScore())
                .relevanceScore(goal.getRelevanceScore())
                .deadline(goal.getDeadline())
                .status(goal.getStatus().name())
                .progress(goal.getProgress())
                .trackId(goal.getCareerTrack() != null ? goal.getCareerTrack().getId() : null)
                .createdAt(goal.getCreatedAt())
                .build();
    }

    private PlaylistResponse mapToResponse(LearningPlaylist playlist) {
        // TODO: Parse items JSON
        return PlaylistResponse.builder()
                .id(playlist.getId())
                .userId(playlist.getUserId())
                .goalId(playlist.getLearningGoal().getId())
                .title(playlist.getTitle())
                .currentIndex(playlist.getCurrentIndex())
                .currentDifficulty(playlist.getCurrentDifficulty().name())
                .build();
    }
}

