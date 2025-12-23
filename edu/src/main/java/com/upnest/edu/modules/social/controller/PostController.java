package com.upnest.edu.modules.social.controller;

import com.upnest.edu.modules.social.entity.SocialPostLite;
import com.upnest.edu.modules.social.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * PostController - REST API cho các hoạt động bài viết
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /**
     * Tạo bài viết mới
     * POST: /api/v1/posts
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestParam Long userId,
            @RequestParam String content,
            @RequestParam(required = false) String imageUrl,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String music,
            @RequestParam(required = false) List<String> tags) {
        
        try {
            SocialPostLite post = postService.createPost(userId, content, imageUrl, location, music, tags);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bài viết đã được tạo");
            response.put("post", post);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating post", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Lấy bảng tin (feed)
     * GET: /api/v1/posts/feed?page=0&size=10
     */
    @GetMapping("/feed")
    public ResponseEntity<Page<SocialPostLite>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SocialPostLite> posts = postService.getFeed(pageable);
        
        return ResponseEntity.ok(posts);
    }

    /**
     * Tìm kiếm bài viết
     * GET: /api/v1/posts/search?q=keyword
     */
    @GetMapping("/search")
    public ResponseEntity<Page<SocialPostLite>> searchPosts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SocialPostLite> posts = postService.searchPosts(q, pageable);
        
        log.info("Searched posts with keyword: {}", q);
        return ResponseEntity.ok(posts);
    }

    /**
     * Lấy chi tiết bài viết
     * GET: /api/v1/posts/{postId}
     */
    @GetMapping("/{postId}")
    public ResponseEntity<SocialPostLite> getPost(@PathVariable Long postId) {
        try {
            SocialPostLite post = postService.getPostById(postId);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    /**
     * Like bài viết
     * POST: /api/v1/posts/{postId}/like
     */
    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> likePost(@PathVariable Long postId, @RequestParam Long userId) {
        try {
            postService.likePost(postId, userId);
            return ResponseEntity.ok(Map.of("success", true, "message", "❤️ Đã thích bài viết"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Unlike bài viết
     * DELETE: /api/v1/posts/{postId}/like
     */
    @DeleteMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> unlikePost(@PathVariable Long postId, @RequestParam Long userId) {
        try {
            postService.unlikePost(postId, userId);
            return ResponseEntity.ok(Map.of("success", true, "message", "🤍 Bỏ thích bài viết"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Ẩn bài viết
     * POST: /api/v1/posts/{postId}/hide
     */
    @PostMapping("/{postId}/hide")
    public ResponseEntity<Map<String, Object>> hidePost(
            @PathVariable Long postId,
            @RequestParam Long userId) {
        try {
            postService.hidePost(postId, userId);
            return ResponseEntity.ok(Map.of("success", true, "message", "👻 Đã ẩn bài viết"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Chia sẻ bài viết
     * POST: /api/v1/posts/{postId}/share
     */
    @PostMapping("/{postId}/share")
    public ResponseEntity<Map<String, Object>> sharePost(
            @PathVariable Long postId,
            @RequestParam Long userId,
            @RequestParam(required = false) String message) {
        try {
            SocialPostLite shared = postService.sharePost(postId, userId, message);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "✈️ Chia sẻ thành công lên tường");
            response.put("post", shared);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sharing post", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Cập nhật bài viết
     * PUT: /api/v1/posts/{postId}
     */
    @PutMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> updatePost(
            @PathVariable Long postId,
            @RequestParam String content,
            @RequestParam(required = false) String imageUrl) {
        try {
            SocialPostLite post = postService.updatePost(postId, content, imageUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bài viết đã được cập nhật");
            response.put("post", post);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Xóa bài viết
     * DELETE: /api/v1/posts/{postId}
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> deletePost(@PathVariable Long postId) {
        try {
            postService.deletePost(postId);
            return ResponseEntity.ok(Map.of("success", true, "message", "🗑️ Bài viết đã bị xóa"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
