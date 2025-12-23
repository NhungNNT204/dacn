package com.upnest.edu.modules.social.controller;

import com.upnest.edu.common.payload.ApiResponse;
import com.upnest.edu.modules.social.entity.SocialCommentLite;
import com.upnest.edu.modules.social.entity.SocialPostLite;
import com.upnest.edu.modules.social.entity.SocialReportLite;
import com.upnest.edu.modules.social.repository.SocialCommentLiteRepository;
import com.upnest.edu.modules.social.repository.SocialPostLiteRepository;
import com.upnest.edu.modules.social.repository.SocialReportLiteRepository;
import com.upnest.edu.modules.social.service.ModerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * SocialController - Controller đơn giản theo snippet cung cấp:
 *  - GET /api/v1/social/feed
 *  - POST /api/v1/social/posts
 *  - POST /api/v1/social/comments/{postId}
 *  - POST /api/v1/social/posts/{id}/like
 *  - POST /api/v1/social/posts/{id}/report
 */
@RestController
@RequestMapping("/api/v1/social")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SocialController {

    private final ModerationService moderationService;
    private final SocialPostLiteRepository postRepository;
    private final SocialCommentLiteRepository commentRepository;
    private final SocialReportLiteRepository reportRepository;

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<List<SocialPostLite>>> getFeed() {
        List<SocialPostLite> feed = postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success(feed, "Tải bảng tin thành công"));
    }

    @PostMapping("/posts")
    public ResponseEntity<ApiResponse<SocialPostLite>> createPost(@RequestBody SocialPostLite post) {
        ModerationService.ModerationResult result = moderationService.validateContent(post.getContent());
        if (!result.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Nội dung vi phạm tiêu chuẩn cộng đồng: " + result.getReason(), "MOD_001"));
        }

        if (post.getCreatedAt() == null) {
            post.setCreatedAt(LocalDateTime.now());
        }

        SocialPostLite saved = postRepository.save(post);
        return ResponseEntity.ok(ApiResponse.success(saved, "Đăng bài thành công"));
    }

    @PostMapping("/comments/{postId}")
    public ResponseEntity<ApiResponse<SocialCommentLite>> addComment(
            @PathVariable Long postId,
            @RequestBody SocialCommentLite comment) {
        ModerationService.ModerationResult result = moderationService.validateContent(comment.getContent());
        if (!result.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Bình luận chứa từ ngữ không phù hợp", "MOD_002"));
        }

        if (!postRepository.existsById(postId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Post không tồn tại", "SOCIAL_POST_NOT_FOUND"));
        }

        comment.setPostId(postId);
        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt(LocalDateTime.now());
        }

        SocialCommentLite saved = commentRepository.save(comment);
        return ResponseEntity.ok(ApiResponse.success(saved, "Bình luận thành công"));
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<ApiResponse<Integer>> likePost(@PathVariable Long id) {
        SocialPostLite post = postRepository.findById(id)
                .orElse(null);
        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Post không tồn tại", "SOCIAL_POST_NOT_FOUND"));
        }

        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
        return ResponseEntity.ok(ApiResponse.success(post.getLikeCount(), "Đã thích bài viết"));
    }

    @PostMapping("/posts/{id}/report")
    public ResponseEntity<ApiResponse<Void>> report(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Post không tồn tại", "SOCIAL_POST_NOT_FOUND"));
        }

        Long reporterId = null;
        if (body.containsKey("reporterId")) {
            try {
                reporterId = Long.valueOf(body.get("reporterId"));
            } catch (NumberFormatException ignored) {
                // leave reporterId as null
            }
        }

        String reason = body.getOrDefault("reason", "");

        SocialReportLite report = SocialReportLite.builder()
                .targetId(id)
                .targetType("POST")
                .reporterId(reporterId)
                .reason(reason)
                .build();
        reportRepository.save(report);

        return ResponseEntity.ok(ApiResponse.success(null, "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xử lý sớm nhất."));
    }
}

