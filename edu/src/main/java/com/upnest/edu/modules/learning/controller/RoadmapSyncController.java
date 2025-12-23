package com.upnest.edu.modules.learning.controller;

import com.upnest.edu.modules.learning.service.RoadmapDataSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * RoadmapSyncController - Controller để sync dữ liệu từ roadmap.sh
 * Endpoint này có thể được gọi từ admin panel hoặc scheduled job
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/learning/roadmap-sync")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoadmapSyncController {

    private final RoadmapDataSyncService syncService;

    /**
     * POST /api/v1/learning/roadmap-sync/all
     * Sync tất cả roadmaps từ roadmap.sh
     */
    @PostMapping("/all")
    public ResponseEntity<Map<String, Object>> syncAllRoadmaps(Authentication authentication) {
        try {
            // TODO: Check admin permission
            Map<String, Object> result = syncService.syncAllRoadmaps();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error syncing all roadmaps", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Error syncing roadmaps: " + e.getMessage()
                ));
        }
    }

    /**
     * POST /api/v1/learning/roadmap-sync/{roadmapKey}
     * Sync một roadmap cụ thể từ roadmap.sh
     */
    @PostMapping("/{roadmapKey}")
    public ResponseEntity<Map<String, Object>> syncRoadmap(
            @PathVariable String roadmapKey,
            Authentication authentication
    ) {
        try {
            // TODO: Check admin permission
            Map<String, Object> result = syncService.syncRoadmap(roadmapKey, 
                "https://roadmap.sh/" + roadmapKey);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error syncing roadmap: {}", roadmapKey, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Error syncing roadmap: " + e.getMessage()
                ));
        }
    }
}

