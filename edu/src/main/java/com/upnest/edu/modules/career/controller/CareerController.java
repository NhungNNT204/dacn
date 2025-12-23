package com.upnest.edu.modules.career.controller;

import com.upnest.edu.modules.career.payload.CareerPathDTO;
import com.upnest.edu.modules.career.payload.CareerRoadmapResponse;
import com.upnest.edu.modules.career.service.CareerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * CareerController - API endpoints cho định hướng nghề nghiệp
 * DISABLED: Service dependency issue with RoadmapStepRepository
 */
@Slf4j
// @RestController
@RequestMapping("/api/v1/career")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CareerController {

    private final CareerService careerService;

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return Long.parseLong(authentication.getName());
    }

    /**
     * GET /api/v1/career/paths
     * Lấy danh sách tất cả career paths
     */
    @GetMapping("/paths")
    public ResponseEntity<List<CareerPathDTO>> getAllCareerPaths(Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        List<CareerPathDTO> paths = careerService.getAllCareerPaths(userId);
        return ResponseEntity.ok(paths);
    }

    /**
     * GET /api/v1/career/roadmap/{careerPathCode}
     * Lấy chi tiết roadmap của một career path
     */
    @GetMapping("/roadmap/{careerPathCode}")
    public ResponseEntity<CareerRoadmapResponse> getCareerRoadmap(
            Authentication auth,
            @PathVariable String careerPathCode
    ) {
        Long userId = getUserIdFromAuthentication(auth);
        CareerRoadmapResponse roadmap = careerService.getCareerRoadmap(userId, careerPathCode);
        return ResponseEntity.ok(roadmap);
    }

    /**
     * POST /api/v1/career/select
     * User chọn một career path
     */
    @PostMapping("/select")
    public ResponseEntity<Map<String, String>> selectCareerPath(
            Authentication auth,
            @RequestBody Map<String, String> request
    ) {
        Long userId = getUserIdFromAuthentication(auth);
        String careerPathCode = request.get("careerPathCode");
        careerService.selectCareerPath(userId, careerPathCode);
        return ResponseEntity.ok(Map.of("message", "Career path selected successfully"));
    }
}

