package com.upnest.edu.modules.learning.controller;

import com.upnest.edu.modules.learning.payload.*;
import com.upnest.edu.modules.learning.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RoadmapController - REST API cho Learning Roadmap
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/learning")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoadmapController {

    private final RoadmapService roadmapService;

    /**
     * GET /api/v1/learning/roadmap
     * Lấy lộ trình học tập của user hiện tại
     */
    @GetMapping("/roadmap")
    public ResponseEntity<LearningRoadmapResponse> getRoadmap(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            LearningRoadmapResponse response = roadmapService.getRoadmap(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting roadmap", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/learning/roadmap/{userId}
     * Lấy lộ trình học tập của user cụ thể (cho admin hoặc chính user đó)
     */
    @GetMapping("/roadmap/{userId}")
    public ResponseEntity<LearningRoadmapResponse> getRoadmapByUserId(@PathVariable Long userId) {
        try {
            LearningRoadmapResponse response = roadmapService.getRoadmap(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting roadmap for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/learning/tracks
     * Lấy danh sách tất cả Career Tracks (để hiển thị trong Modal "Tùy chỉnh mục tiêu")
     */
    @GetMapping("/tracks")
    public ResponseEntity<List<CareerTrackDTO>> getAllCareerTracks() {
        try {
            List<CareerTrackDTO> tracks = roadmapService.getAllCareerTracks();
            return ResponseEntity.ok(tracks);
        } catch (Exception e) {
            log.error("Error getting career tracks", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /api/v1/learning/roadmap/goal
     * Cập nhật Career Track (mục tiêu nghề nghiệp) cho user
     * Endpoint này sẽ kích hoạt AI regeneration
     */
    @PutMapping("/roadmap/goal")
    public ResponseEntity<LearningRoadmapResponse> updateCareerTrack(
            @RequestBody UpdateCareerTrackRequest request,
            Authentication authentication
    ) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            LearningRoadmapResponse response = roadmapService.updateCareerTrack(userId, request.getTrackCode());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error updating career track", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error updating career track", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Helper method để lấy userId từ Authentication
     * TODO: Cần tích hợp với JWT token để lấy userId thực tế từ authentication
     */
    private Long getUserIdFromAuthentication(Authentication authentication) {
        // Tạm thời dùng userId = 1L để test, cần thay bằng JWT token sau này
        if (authentication == null) {
            return 1L; // Default user for testing
        }
        
        // TODO: Extract userId from JWT token or UserDetails
        // Ví dụ: 
        // UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // Long userId = userService.findByUsername(userDetails.getUsername()).getId();
        
        return 1L; // Temporary hardcoded for testing
    }
}

