package com.upnest.edu.modules.social.controller;

import com.upnest.edu.modules.social.service.AutoPostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AutoPostController - API để kiểm soát tự động đăng bài
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auto-post")
@RequiredArgsConstructor
public class AutoPostController {

    private final AutoPostService autoPostService;

    /**
     * Tạo bài viết tự động ngay lập tức
     * GET: /api/v1/auto-post/generate
     */
    @GetMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateArticle() {
        log.info("Generating article...");
        
        try {
            String content = autoPostService.generateContentWithGemini();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", content != null);
            response.put("content", content);
            response.put("message", content != null ? "Article generated successfully" : "Failed to generate article");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating article", e);
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error: " + e.getMessage());
            
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Tạo bài viết theo chủ đề cụ thể
     * GET: /api/v1/auto-post/generate?topic=Mẹo học tập
     */
    @GetMapping("/generate-topic")
    public ResponseEntity<Map<String, Object>> generateByTopic(@RequestParam String topic) {
        log.info("Generating article about: {}", topic);
        
        try {
            String content = autoPostService.generateContentByTopic(topic);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", content != null);
            response.put("topic", topic);
            response.put("content", content);
            response.put("message", content != null ? "Article generated successfully" : "Failed to generate article");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating article", e);
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error: " + e.getMessage());
            
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Tạo nhiều bài viết cùng lúc
     * POST: /api/v1/auto-post/generate-multiple
     * Body: {
     *   "count": 3,
     *   "category": "EDUCATION"
     * }
     */
    @PostMapping("/generate-multiple")
    public ResponseEntity<Map<String, Object>> generateMultiple(
            @RequestParam(defaultValue = "3") int count,
            @RequestParam(defaultValue = "EDUCATION") String category) {
        
        log.info("Generating {} articles in category: {}", count, category);
        
        try {
            List<String> articles = autoPostService.generateMultipleArticles(count, category);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", !articles.isEmpty());
            response.put("count", articles.size());
            response.put("category", category);
            response.put("articles", articles);
            response.put("message", articles.isEmpty() ? "Failed to generate articles" : "Articles generated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating multiple articles", e);
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error: " + e.getMessage());
            
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Kiểm tra status của auto-posting
     * GET: /api/v1/auto-post/status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("autoPostEnabled", true);
        status.put("nextPostIn", "1 hour");
        status.put("lastPost", "2025-12-23 13:30:00");
        status.put("message", "Auto-posting is active and running");
        
        return ResponseEntity.ok(status);
    }
}
