package com.upnest.edu.modules.video.controller;

import com.upnest.edu.modules.video.entity.VideoCategory;
import com.upnest.edu.modules.video.entity.VideoLevel;
import com.upnest.edu.modules.video.payload.*;
import com.upnest.edu.modules.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/videos")
@RequiredArgsConstructor
@Slf4j
public class VideoController {

    private final VideoService videoService;

    private String getCurrentUserId(Authentication authentication) {
        return authentication != null ? authentication.getName() : null;
    }

    // ==================== VIDEO CRUD ====================

    @PostMapping
    public ResponseEntity<?> createVideo(
            @RequestBody CreateVideoRequest request,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoDTO video = videoService.createVideo(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(video);
        } catch (Exception e) {
            log.error("Error creating video", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{videoId}")
    public ResponseEntity<?> updateVideo(
            @PathVariable String videoId,
            @RequestBody UpdateVideoRequest request,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoDTO video = videoService.updateVideo(videoId, request, userId);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            log.error("Error updating video", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<?> deleteVideo(
            @PathVariable String videoId,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            videoService.deleteVideo(videoId, userId);
            return ResponseEntity.ok(Map.of("message", "Video deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting video", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VideoDTO> videos = videoService.getAllVideos(pageable);
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            log.error("Error fetching videos", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<?> getVideoDetail(
            @PathVariable String videoId,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoDetailDTO video = videoService.getVideoDetail(videoId, userId);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            log.error("Error fetching video detail", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== VIDEO DISCOVERY ====================

    @GetMapping("/discover/trending")
    public ResponseEntity<?> getTrendingVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VideoDTO> videos = videoService.getTrendingVideos(pageable);
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            log.error("Error fetching trending videos", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/discover/popular")
    public ResponseEntity<?> getPopularVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VideoDTO> videos = videoService.getPopularVideos(pageable);
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            log.error("Error fetching popular videos", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/discover/recent")
    public ResponseEntity<?> getRecentVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VideoDTO> videos = videoService.getRecentVideos(pageable);
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            log.error("Error fetching recent videos", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getVideosByCategory(
            @PathVariable VideoCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VideoDTO> videos = videoService.getVideosByCategory(category, pageable);
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            log.error("Error fetching videos by category", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<?> getVideosByLevel(
            @PathVariable VideoLevel level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VideoDTO> videos = videoService.getVideosByLevel(level, pageable);
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            log.error("Error fetching videos by level", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<?> getVideosByCreator(
            @PathVariable String creatorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VideoDTO> videos = videoService.getVideosByCreator(creatorId, pageable);
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            log.error("Error fetching videos by creator", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchVideos(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VideoDTO> videos = videoService.searchVideos(keyword, pageable);
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            log.error("Error searching videos", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{videoId}/recommendations")
    public ResponseEntity<?> getRecommendations(
            @PathVariable String videoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VideoDTO> videos = videoService.getRecommendations(videoId, pageable);
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            log.error("Error fetching recommendations", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== VIDEO PUBLISH ====================

    @PostMapping("/{videoId}/publish")
    public ResponseEntity<?> publishVideo(
            @PathVariable String videoId,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoDTO video = videoService.publishVideo(videoId, userId);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            log.error("Error publishing video", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{videoId}/archive")
    public ResponseEntity<?> archiveVideo(
            @PathVariable String videoId,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoDTO video = videoService.archiveVideo(videoId, userId);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            log.error("Error archiving video", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== LIKE FUNCTIONALITY ====================

    @PostMapping("/{videoId}/like")
    public ResponseEntity<?> likeVideo(
            @PathVariable String videoId,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoDTO video = videoService.likeVideo(videoId, userId);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            log.error("Error liking video", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{videoId}/unlike")
    public ResponseEntity<?> unlikeVideo(
            @PathVariable String videoId,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoDTO video = videoService.unlikeVideo(videoId, userId);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            log.error("Error unliking video", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{videoId}/is-liked")
    public ResponseEntity<?> isVideoLiked(
            @PathVariable String videoId,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            boolean isLiked = videoService.isVideoLikedByUser(videoId, userId);
            return ResponseEntity.ok(Map.of("isLiked", isLiked));
        } catch (Exception e) {
            log.error("Error checking if video is liked", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== COMMENT FUNCTIONALITY ====================

    @PostMapping("/{videoId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable String videoId,
            @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoCommentDTO comment = videoService.addComment(videoId, request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (Exception e) {
            log.error("Error adding comment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{videoId}/comments")
    public ResponseEntity<?> getVideoComments(
            @PathVariable String videoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VideoCommentDTO> comments = videoService.getVideoComments(videoId, pageable);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            log.error("Error fetching comments", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{videoId}/comments/{commentId}/replies")
    public ResponseEntity<?> replyToComment(
            @PathVariable String videoId,
            @PathVariable String commentId,
            @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoCommentDTO reply = videoService.replyToComment(videoId, commentId, request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(reply);
        } catch (Exception e) {
            log.error("Error replying to comment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/comments/{commentId}/replies")
    public ResponseEntity<?> getCommentReplies(
            @PathVariable String commentId) {
        try {
            List<VideoCommentDTO> replies = videoService.getCommentReplies(commentId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            log.error("Error fetching replies", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable String commentId,
            @RequestBody UpdateCommentRequest request,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoCommentDTO comment = videoService.updateComment(commentId, request, userId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            log.error("Error updating comment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String commentId,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            videoService.deleteComment(commentId, userId);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting comment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== COMMENT LIKES ====================

    @PostMapping("/comments/{commentId}/like")
    public ResponseEntity<?> likeComment(
            @PathVariable String commentId,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoCommentDTO comment = videoService.likeComment(commentId, userId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            log.error("Error liking comment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/comments/{commentId}/unlike")
    public ResponseEntity<?> unlikeComment(
            @PathVariable String commentId,
            Authentication authentication) {
        try {
            String userId = getCurrentUserId(authentication);
            VideoCommentDTO comment = videoService.unlikeComment(commentId, userId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            log.error("Error unliking comment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
