package com.upnest.edu.modules.social.controller;

import com.upnest.edu.modules.social.entity.*;
import com.upnest.edu.modules.social.payload.*;
import com.upnest.edu.modules.social.service.FeedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * PostController - REST API cho quản lý bài đăng và dòng thời gian
 */
@RestController
@RequestMapping("/api/v1/social/posts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class PostController {
    
    private final FeedService feedService;
    
    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return Long.parseLong(authentication.getName());
    }
    
    private String getCurrentUserName(Authentication auth) {
        // TODO: Get from user service
        return "User";
    }
    
    private String getCurrentUserAvatar(Authentication auth) {
        // TODO: Get from user service
        return null;
    }
    
    /**
     * GET: /api/v1/social/posts/feed
     * Lấy dòng thời gian cá nhân hoá
     */
    @GetMapping("/feed")
    public ResponseEntity<?> getPersonalizedFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        try {
            Long userId = getUserIdFromAuthentication(auth);
            Pageable pageable = PageRequest.of(page, size);
            Page<Post> posts = feedService.getPersonalizedFeed(userId, pageable);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", posts.getContent(),
                    "totalPages", posts.getTotalPages(),
                    "totalElements", posts.getTotalElements()
            ));
        } catch (Exception e) {
            log.error("Error getting personalized feed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * GET: /api/v1/social/posts/trending
     * Lấy bài đăng trending
     */
    @GetMapping("/trending")
    public ResponseEntity<?> getTrendingFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Post> posts = feedService.getTrendingFeed(pageable);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", posts.getContent(),
                    "totalPages", posts.getTotalPages(),
                    "totalElements", posts.getTotalElements()
            ));
        } catch (Exception e) {
            log.error("Error getting trending feed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * GET: /api/v1/social/posts/saved
     * Lấy bài đăng được lưu
     */
    @GetMapping("/saved")
    public ResponseEntity<?> getSavedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Long userId = getCurrentUserId();
            Pageable pageable = PageRequest.of(page, size);
            Page<Post> posts = feedService.getSavedPosts(userId, pageable);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", posts.getContent(),
                    "totalPages", posts.getTotalPages(),
                    "totalElements", posts.getTotalElements()
            ));
        } catch (Exception e) {
            log.error("Error getting saved posts", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * POST: /api/v1/social/posts/create
     * Tạo bài đăng mới
     */
    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody CreatePostRequest request, Authentication auth) {
        try {
            Long userId = getUserIdFromAuthentication(auth);
            PostType postType = PostType.valueOf(request.getPostType().toUpperCase());
            
            Post post = feedService.createPost(
                    userId,
                    getCurrentUserName(auth),
                    getCurrentUserAvatar(auth),
                    request.getContent(),
                    postType,
                    request.getImageUrl(),
                    request.getVideoUrl(),
                    request.getVideoThumbnail()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("success", true, "data", post));
        } catch (Exception e) {
            log.error("Error creating post", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * POST: /api/v1/social/posts/{postId}/react
     * Thêm reaction vào bài đăng
     */
    @PostMapping("/{postId}/react")
    public ResponseEntity<?> addReaction(
            @PathVariable Long postId,
            @RequestBody AddReactionRequest request) {
        try {
            Long userId = getCurrentUserId();
            ReactionType reactionType = ReactionType.valueOf(request.getReactionType().toUpperCase());
            
            PostReaction reaction = feedService.addReaction(
                    postId,
                    userId,
                    getCurrentUserName(),
                    getCurrentUserAvatar(),
                    reactionType
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            if (reaction != null) {
                response.put("data", reaction);
                response.put("action", "added");
            } else {
                response.put("action", "removed");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error adding reaction", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * GET: /api/v1/social/posts/{postId}/reactions
     * Lấy reactions của bài đăng
     */
    @GetMapping("/{postId}/reactions")
    public ResponseEntity<?> getPostReactions(@PathVariable Long postId) {
        try {
            List<PostReaction> reactions = feedService.getPostReactions(postId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", reactions,
                    "total", reactions.size()
            ));
        } catch (Exception e) {
            log.error("Error getting reactions", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * POST: /api/v1/social/posts/{postId}/comments
     * Bình luận trên bài đăng
     */
    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long postId,
            @RequestBody AddCommentRequest request) {
        try {
            Long userId = getCurrentUserId();
            
            PostComment comment = feedService.addComment(
                    postId,
                    userId,
                    getCurrentUserName(),
                    getCurrentUserAvatar(),
                    request.getContent(),
                    request.getImageUrl()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("success", true, "data", comment));
        } catch (Exception e) {
            log.error("Error adding comment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * GET: /api/v1/social/posts/{postId}/comments
     * Lấy bình luận của bài đăng
     */
    @GetMapping("/{postId}/comments")
    public ResponseEntity<?> getPostComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<PostComment> comments = feedService.getPostComments(postId, pageable);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", comments.getContent(),
                    "totalPages", comments.getTotalPages(),
                    "totalElements", comments.getTotalElements()
            ));
        } catch (Exception e) {
            log.error("Error getting comments", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * POST: /api/v1/social/posts/{postId}/comments/{commentId}/reply
     * Reply bình luận
     */
    @PostMapping("/{postId}/comments/{commentId}/reply")
    public ResponseEntity<?> addReply(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody AddReplyRequest request) {
        try {
            Long userId = getCurrentUserId();
            
            PostComment reply = feedService.addReply(
                    postId,
                    commentId,
                    userId,
                    getCurrentUserName(),
                    getCurrentUserAvatar(),
                    request.getContent()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("success", true, "data", reply));
        } catch (Exception e) {
            log.error("Error adding reply", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * GET: /api/v1/social/posts/{postId}/comments/{commentId}/replies
     * Lấy reply của bình luận
     */
    @GetMapping("/{postId}/comments/{commentId}/replies")
    public ResponseEntity<?> getCommentReplies(@PathVariable Long commentId) {
        try {
            List<PostComment> replies = feedService.getCommentReplies(commentId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", replies,
                    "total", replies.size()
            ));
        } catch (Exception e) {
            log.error("Error getting replies", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * DELETE: /api/v1/social/posts/{postId}/comments/{commentId}
     * Xóa bình luận
     */
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            feedService.deleteComment(commentId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Comment deleted"));
        } catch (Exception e) {
            log.error("Error deleting comment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * POST: /api/v1/social/posts/{postId}/share
     * Chia sẻ bài đăng
     */
    @PostMapping("/{postId}/share")
    public ResponseEntity<?> sharePost(
            @PathVariable Long postId,
            @RequestBody SharePostRequest request) {
        try {
            Long userId = getCurrentUserId();
            ShareType shareType = ShareType.valueOf(request.getShareType().toUpperCase());
            
            PostShare share = feedService.sharePost(
                    postId,
                    userId,
                    getCurrentUserName(),
                    request.getShareMessage(),
                    shareType
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("success", true, "data", share));
        } catch (Exception e) {
            log.error("Error sharing post", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * POST: /api/v1/social/posts/{postId}/save
     * Lưu bài đăng
     */
    @PostMapping("/{postId}/save")
    public ResponseEntity<?> savePost(@PathVariable Long postId) {
        try {
            Long userId = getCurrentUserId();
            PostSave save = feedService.savePost(postId, userId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", save,
                    "message", "Post saved successfully"
            ));
        } catch (Exception e) {
            log.error("Error saving post", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * DELETE: /api/v1/social/posts/{postId}/save
     * Bỏ lưu bài đăng
     */
    @DeleteMapping("/{postId}/save")
    public ResponseEntity<?> unsavePost(@PathVariable Long postId) {
        try {
            Long userId = getCurrentUserId();
            feedService.unsavePost(postId, userId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Post unsaved successfully"
            ));
        } catch (Exception e) {
            log.error("Error unsaving post", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * GET: /api/v1/social/posts/{postId}/is-saved
     * Kiểm tra bài đăng đã được lưu
     */
    @GetMapping("/{postId}/is-saved")
    public ResponseEntity<?> isPostSaved(@PathVariable Long postId) {
        try {
            Long userId = getCurrentUserId();
            Boolean isSaved = feedService.isPostSaved(postId, userId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "isSaved", isSaved
            ));
        } catch (Exception e) {
            log.error("Error checking if post is saved", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * POST: /api/v1/social/posts/{postId}/report
     * Báo cáo bài đăng
     */
    @PostMapping("/{postId}/report")
    public ResponseEntity<?> reportPost(
            @PathVariable Long postId,
            @RequestBody ReportPostRequest request) {
        try {
            Long userId = getCurrentUserId();
            ReportType reportType = ReportType.valueOf(request.getReportType().toUpperCase());
            
            PostReport report = feedService.reportPost(
                    postId,
                    userId,
                    getCurrentUserName(),
                    reportType,
                    request.getReason()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "success", true,
                            "data", report,
                            "message", "Post reported successfully"
                    ));
        } catch (Exception e) {
            log.error("Error reporting post", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * POST: /api/v1/social/posts/{postId}/hide
     * Ẩn bài đăng
     */
    @PostMapping("/{postId}/hide")
    public ResponseEntity<?> hidePost(@PathVariable Long postId) {
        try {
            Long userId = getCurrentUserId();
            feedService.hidePost(postId, userId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Post hidden successfully"
            ));
        } catch (Exception e) {
            log.error("Error hiding post", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * DELETE: /api/v1/social/posts/{postId}
     * Xóa bài đăng
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            Long userId = getCurrentUserId();
            feedService.deletePost(postId, userId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Post deleted successfully"
            ));
        } catch (Exception e) {
            log.error("Error deleting post", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * GET: /api/v1/social/posts/search?keyword=
     * Tìm kiếm bài đăng
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Post> posts = feedService.searchPosts(keyword, pageable);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", posts.getContent(),
                    "totalPages", posts.getTotalPages(),
                    "totalElements", posts.getTotalElements()
            ));
        } catch (Exception e) {
            log.error("Error searching posts", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * GET: /api/v1/social/posts/{postId}/stats
     * Lấy thống kê của bài đăng
     */
    @GetMapping("/{postId}/stats")
    public ResponseEntity<?> getPostStats(@PathVariable Long postId) {
        try {
            Map<String, Object> stats = feedService.getPostStats(postId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", stats
            ));
        } catch (Exception e) {
            log.error("Error getting post stats", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
