package com.upnest.edu.modules.learning.controller;

import com.upnest.edu.modules.learning.payload.DashboardResponse;
import com.upnest.edu.modules.learning.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * DashboardController - REST API cho Dashboard
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /api/v1/dashboard
     * Lấy dữ liệu dashboard của user hiện tại
     */
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            DashboardResponse response = dashboardService.getDashboardData(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting dashboard", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/dashboard/{userId}
     * Lấy dữ liệu dashboard của user cụ thể (cho admin)
     */
    @GetMapping("/{userId}")
    public ResponseEntity<DashboardResponse> getDashboardByUserId(@PathVariable Long userId) {
        try {
            DashboardResponse response = dashboardService.getDashboardData(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting dashboard for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/v1/dashboard/streak/update
     * Cập nhật streak khi user có hoạt động học tập
     */
    @PostMapping("/streak/update")
    public ResponseEntity<Void> updateStreak(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            dashboardService.updateStreak(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error updating streak", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Helper method để lấy userId từ Authentication
     */
    private Long getUserIdFromAuthentication(Authentication authentication) {
        // Tạm thời dùng userId = 1L để test, cần thay bằng JWT token sau này
        if (authentication == null) {
            return 1L; // Default user for testing
        }
        
        // TODO: Extract userId from JWT token or UserDetails
        return 1L; // Temporary hardcoded for testing
    }
}

