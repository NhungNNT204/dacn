package com.upnest.edu.modules.learning.controller;

import com.upnest.edu.modules.learning.service.ProfessionalRoadmapService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ProfessionalRoadmapController - REST API cho Professional Learning Roadmap
 * Lấy cảm hứng từ roadmap.sh
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/learning/professional-roadmap")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfessionalRoadmapController {

    private final ProfessionalRoadmapService roadmapService;

    /**
     * GET /api/v1/learning/professional-roadmap
     * Lấy danh sách tất cả roadmaps có sẵn
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllRoadmaps() {
        try {
            List<Map<String, Object>> roadmaps = roadmapService.getAllAvailableRoadmaps();
            return ResponseEntity.ok(roadmaps);
        } catch (Exception e) {
            log.error("Error getting all roadmaps", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/learning/professional-roadmap/{roadmapKey}
     * Lấy roadmap data cho một roadmap cụ thể
     */
    @GetMapping("/{roadmapKey}")
    public ResponseEntity<Map<String, Object>> getRoadmap(
            @PathVariable String roadmapKey,
            Authentication authentication
    ) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            Map<String, Object> roadmap = roadmapService.getRoadmapWithProgress(roadmapKey, userId);
            return ResponseEntity.ok(roadmap);
        } catch (Exception e) {
            log.error("Error getting roadmap: {}", roadmapKey, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/v1/learning/professional-roadmap/select
     * User chọn một roadmap làm lộ trình học tập chính
     */
    @PostMapping("/select")
    public ResponseEntity<Map<String, Object>> selectRoadmap(
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            String roadmapKey = request.get("roadmapKey");

            if (roadmapKey == null || roadmapKey.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "roadmapKey is required"
                ));
            }

            Map<String, Object> result = roadmapService.selectRoadmap(userId, roadmapKey);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error selecting roadmap", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Error selecting roadmap: " + e.getMessage()
                ));
        }
    }

    /**
     * GET /api/v1/learning/professional-roadmap/selected
     * Lấy roadmap đã chọn của user
     */
    @GetMapping("/selected")
    public ResponseEntity<Map<String, Object>> getSelectedRoadmap(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            Map<String, Object> selected = roadmapService.getSelectedRoadmap(userId);
            
            if (selected == null) {
                return ResponseEntity.ok(Map.of(
                    "hasSelection", false,
                    "message", "Chưa chọn lộ trình nào"
                ));
            }

            return ResponseEntity.ok(selected);
        } catch (Exception e) {
            log.error("Error getting selected roadmap", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Helper method để lấy userId từ Authentication
     */
    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null) {
            return 1L; // Default user for testing
        }
        // TODO: Extract userId from JWT token
        return 1L;
    }
}

